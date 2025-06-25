#[cfg(test)]
mod test {
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use snforge_std::{
        CheatSpan, ContractClassTrait, DeclareResultTrait, cheat_caller_address, declare,
        start_cheat_caller_address, stop_cheat_caller_address,
    };
    use spott_contract::components::product::MockProduct::{
        IExternalDispatcher, IExternalDispatcherTrait,
    };
    use spott_contract::components::product::interface::{
        IProductDispatcher, IProductDispatcherTrait,
    };
    use starknet::{ContractAddress, contract_address_const, get_block_timestamp};

    // Test accounts
    // fn VENDOR() -> ContractAddress {
    //     contract_address_const::<'VENDOR'>()
    // }

    fn VENDOR() -> ContractAddress {
    'VENDOR'.try_into().unwrap()
}

    // fn BUYER() -> ContractAddress {
    //     contract_address_const::<'BUYER'>()
    // }

     fn BUYER() -> ContractAddress {
    'BUYER'.try_into().unwrap()
}

    // fn OWNER() -> ContractAddress {
    //     contract_address_const::<'OWNER'>()
    // }

    fn OWNER() -> ContractAddress {
    'OWNER'.try_into().unwrap()
}


    // Deploy MockProduct contract
    fn setup() -> ContractAddress {
        let declare_result = declare("MockProduct");
        assert(declare_result.is_ok(), 'Contract declaration failed');

        let contract_class = declare_result.unwrap().contract_class();
        let mut calldata = array![OWNER().into()];
        let (contract_address, _) = contract_class.deploy(@calldata).unwrap();

        let dispatcher = IExternalDispatcher { contract_address };

        dispatcher.mint(BUYER(), 100000000000000000000);
        dispatcher.mint(VENDOR(), 100000000000000000000);
        dispatcher.mint(OWNER(), 100000000000000000000);

        contract_address
    }

    #[test]
    fn test_deployment() {
        let contract_address = setup();
        let erc20_dispatcher = IERC20Dispatcher { contract_address };

        let owner_bal = erc20_dispatcher.balance_of(OWNER());
        let vendor_bal = erc20_dispatcher.balance_of(VENDOR());
        let buyer_bal = erc20_dispatcher.balance_of(BUYER());

        assert(owner_bal == 100000000000000000000, 'owner error');
        assert(vendor_bal == 100000000000000000000, 'vendor error');
        assert(buyer_bal == 100000000000000000000, 'buyer error');
    }


    #[test]
    fn test_add_product() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let vendor = VENDOR();

        // Verify initial state
        let product_count = product_dispatcher.get_product_count();
        assert(product_count == 0, 'product count should be 0');

        // Add product as vendor
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Test Product",
                price: 100,
                stock: 25,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        assert(product_id == 1, 'product_id should be 1');

        // Verify product details
        let product = product_dispatcher.get_product(product_id);
        assert(product.id == 1, 'product id mismatch');
        assert(product.vendor == vendor, 'vendor mismatch');
        assert(product.price == 100, 'price mismatch');
        assert(product.stock == 25, 'stock mismatch');
        assert(product.active, 'product should be active');
        assert(product_dispatcher.get_product_count() == 1, 'product count should be 1');

        // Verify vendor products
        let vendor_products = product_dispatcher.get_products_by_vendor(vendor);
        assert(vendor_products.len() == 1, 'vendor product count mismatch');
        assert(*vendor_products.at(0).id == 1, 'vendor product id mismatch');
    }

    #[test]
    fn test_update_product() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let vendor = VENDOR();

        // Verify initial state
        let product_count = product_dispatcher.get_product_count();
        assert(product_count == 0, 'product count should be 0');

        // Add product as vendor
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Test Product",
                price: 100,
                stock: 25,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        assert(product_id == 1, 'product_id should be 1');

        // move onto updating product

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher
            .update_product(
                id: product_id,
                title: "New Test Product",
                price: 300,
                stock: 30,
                video_url: "https://example2.com/new_video",
                metadata_uri: "https://example.com/new_metadatav2",
            );
        stop_cheat_caller_address(contract_address);

        // Verify product details
        let product = product_dispatcher.get_product(product_id);
        assert(product.id == 1, 'product id mismatch');
        assert(product.vendor == vendor, 'vendor mismatch');
        assert(product.price == 300, 'price mismatch');
        assert(product.stock == 30, 'stock mismatch');
        assert(product.active, 'product should be active');
        assert(product_dispatcher.get_product_count() == 1, 'product count should be 1');
    }


#[test]
fn test_place_order_with_payment() {
    let contract_address = setup();
    let product_dispatcher = IProductDispatcher { contract_address };
    let erc20_dispatcher = IERC20Dispatcher { contract_address };
    let vendor = VENDOR();
    let buyer = BUYER();

    // Add a product as vendor
    start_cheat_caller_address(contract_address, vendor);
    let product_id = product_dispatcher
        .add_product(
            title: "Test Product",
            price: 300,
            stock: 25,
            video_url: "https://example.com/video",
            metadata_uri: "https://example.com/metadata",
        );
    stop_cheat_caller_address(contract_address);

    // Check buyer balance before order
    let buyer_balance_before = erc20_dispatcher.balance_of(buyer);
    assert(buyer_balance_before >= 600, 'insufficient buyer balance');

    // The key fix: approve from buyer's perspective, not from contract's perspective
    // We need to cheat the caller address to be the buyer BEFORE calling approve
    start_cheat_caller_address(contract_address, buyer);
    let allowance_before = erc20_dispatcher.allowance(buyer, contract_address);
    println!("Allowance before: {}", allowance_before);

    // Approve the contract to spend buyer's tokens
    erc20_dispatcher.approve(contract_address, 600);
    
    // Verify approval worked
    let allowance_after = erc20_dispatcher.allowance(buyer, contract_address);
    println!("Allowance after: {}", allowance_after);
    assert(allowance_after >= 600, 'approval failed');

    // Place order as buyer (still as buyer)
    let order_id = product_dispatcher.place_order(product_id, 2, contract_address);
    stop_cheat_caller_address(contract_address);

    assert(order_id == 1, 'order_id should be 1');

    // Verify payment was transferred
    let buyer_balance_after = erc20_dispatcher.balance_of(buyer);
    let contract_balance = erc20_dispatcher.balance_of(contract_address);

    assert(buyer_balance_after == buyer_balance_before - 600, 'payment not deducted');
    assert(contract_balance == 600, 'payment not received');

    // Verify order details
    let order = product_dispatcher.get_order(order_id);
    assert(order.buyer == buyer, 'order buyer mismatch');
    assert(order.product_id == product_id, 'order product_id mismatch');
    assert(order.quantity == 2, 'order quantity mismatch');
    assert(order.total == 600, 'order total mismatch');
    assert(!order.shipped, 'order should not be shipped');
    assert(!order.delivered, 'order should not be delivered');

    // Verify stock was reduced
    let product = product_dispatcher.get_product(product_id);
    assert(product.stock == 23, 'stock should be reduced');
}

