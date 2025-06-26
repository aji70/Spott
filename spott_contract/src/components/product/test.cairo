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
    fn VENDOR() -> ContractAddress {
        'VENDOR'.try_into().unwrap()
    }


    fn BUYER() -> ContractAddress {
        'BUYER'.try_into().unwrap()
    }

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
        erc20_dispatcher.allowance(buyer, contract_address);

        // Approve the contract to spend buyer's tokens
        erc20_dispatcher.approve(contract_address, 600);

        // Verify approval worked
        let allowance_after = erc20_dispatcher.allowance(buyer, contract_address);
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

    #[test]
    fn test_get_reviews_by_vendor() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let erc20_dispatcher = IERC20Dispatcher { contract_address };
        let vendor = VENDOR();
        let buyer = BUYER();

        // Add product
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Multi Review Product",
                price: 100,
                stock: 10,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        // First order and review
        start_cheat_caller_address(contract_address, buyer);
        erc20_dispatcher.approve(contract_address, 200); // Approve enough for both orders
        let order_id1 = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id1);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        product_dispatcher.confirm_delivery(order_id1);
        product_dispatcher.submit_review(order_id1, 5, "Excellent product!");
        stop_cheat_caller_address(contract_address);

        // Second order and review - buyer is still in the same cheat session
        start_cheat_caller_address(contract_address, buyer);
        let order_id2 = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id2);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        product_dispatcher.confirm_delivery(order_id2);
        product_dispatcher.submit_review(order_id2, 4, "Good product!");
        stop_cheat_caller_address(contract_address);

        // Verify reviews
        let reviews = product_dispatcher.get_reviews_by_vendor(vendor);
        assert(reviews.len() == 2, 'should have 2 reviews');
        assert(
            product_dispatcher.get_review_count_by_vendor(vendor) == 2, 'review count should be 2',
        );

        let review1 = reviews.at(0);
        let review2 = reviews.at(1);
        assert(*review1.rating == 5, 'first review rating mismatch');
        assert(*review2.rating == 4, 'second review rating mismatch');
    }


    #[test]
    fn test_activate_and_deactivate_product() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let vendor = VENDOR();

        // Add product
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Activation Product",
                price: 100,
                stock: 10,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );

        // Verify product is active by default
        let product = product_dispatcher.get_product(product_id);
        assert(product.active, 'product should be active');

        // Deactivate product
        product_dispatcher.deactivate_product(product_id);
        let product = product_dispatcher.get_product(product_id);
        assert(!product.active, 'product should be deactivated');

        // Reactivate product
        product_dispatcher.activate_product(product_id);
        let product = product_dispatcher.get_product(product_id);
        assert(product.active, 'product should be reactivated');

        stop_cheat_caller_address(contract_address);
    }

    #[test]
    fn test_mark_as_shipped() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let erc20_dispatcher = IERC20Dispatcher { contract_address };
        let vendor = VENDOR();
        let buyer = BUYER();

        // Add product and place order
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Shipping Product",
                price: 200,
                stock: 5,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        erc20_dispatcher.approve(contract_address, 200);
        let order_id = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        // Verify order is not shipped initially
        let order = product_dispatcher.get_order(order_id);
        assert(!order.shipped, 'order should not be shipped');

        // Mark as shipped by vendor
        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id);
        stop_cheat_caller_address(contract_address);

        // Verify order is now shipped
        let order = product_dispatcher.get_order(order_id);
        assert(order.shipped, 'order should be shipped');
    }


    #[test]
    fn test_confirm_delivery() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let erc20_dispatcher = IERC20Dispatcher { contract_address };
        let vendor = VENDOR();
        let buyer = BUYER();

        // Complete order up to shipping
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Delivery Product",
                price: 150,
                stock: 8,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        erc20_dispatcher.approve(contract_address, 150);
        let order_id = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id);
        stop_cheat_caller_address(contract_address);

        // Verify order is not delivered initially
        let order = product_dispatcher.get_order(order_id);
        assert(!order.delivered, 'order should not be delivered');
        assert(!order.confirmed, 'order should not be confirmed');

        // Confirm delivery by buyer
        start_cheat_caller_address(contract_address, buyer);
        product_dispatcher.confirm_delivery(order_id);
        stop_cheat_caller_address(contract_address);

        // Verify order is now delivered and confirmed
        let order = product_dispatcher.get_order(order_id);
        assert(order.delivered, 'order should be delivered');
        assert(order.confirmed, 'order should be confirmed');
    }


    #[test]
    fn test_raise_dispute_order() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let erc20_dispatcher = IERC20Dispatcher { contract_address };
        let vendor = VENDOR();
        let buyer = BUYER();

        // Setup order
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Dispute Product",
                price: 300,
                stock: 5,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        erc20_dispatcher.approve(contract_address, 300);
        let order_id = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id);
        stop_cheat_caller_address(contract_address);

        // Raise dispute as buyer
        start_cheat_caller_address(contract_address, buyer);
        product_dispatcher.raise_dispute(order_id);
        stop_cheat_caller_address(contract_address);

        let order = product_dispatcher.get_order(order_id);
        assert(order.disputed, 'order should be disputed');
    }


    // #[test]
    // fn test_release_funds() {
    //     let contract_address = setup();
    //     let product_dispatcher = IProductDispatcher { contract_address };
    //     let erc20_dispatcher = IERC20Dispatcher { contract_address };
    //     let vendor = VENDOR();
    //     let buyer = BUYER();

    //     // Complete order up to confirmation
    //     start_cheat_caller_address(contract_address, vendor);
    //     let product_id = product_dispatcher
    //         .add_product(
    //             title: "Funds Product",
    //             price: 250,
    //             stock: 5,
    //             video_url: "https://example.com/video",
    //             metadata_uri: "https://example.com/metadata",
    //         );
    //     stop_cheat_caller_address(contract_address);

    //     start_cheat_caller_address(contract_address, buyer);
    //     erc20_dispatcher.approve(contract_address, 250);
    //     let order_id = product_dispatcher.place_order(product_id, 1, contract_address);
    //     stop_cheat_caller_address(contract_address);

    //     start_cheat_caller_address(contract_address, vendor);
    //     product_dispatcher.mark_as_shipped(order_id);
    //     stop_cheat_caller_address(contract_address);

    //     start_cheat_caller_address(contract_address, buyer);
    //     product_dispatcher.confirm_delivery(order_id);
    //     stop_cheat_caller_address(contract_address);

    //     // Check vendor balance before funds release
    //     let vendor_balance_before = erc20_dispatcher.balance_of(vendor);
    //     let order = product_dispatcher.get_order(order_id);
    //     assert(!order.released, 'funds released earlier');

    //     // Release funds
    //     start_cheat_caller_address(contract_address, vendor);
    //     product_dispatcher.release_funds(order_id, contract_address);
    //     stop_cheat_caller_address(contract_address);

    //     // Verify funds were released
    //     let vendor_balance_after = erc20_dispatcher.balance_of(vendor);
    //     let order = product_dispatcher.get_order(order_id);

    //     assert(order.released, 'funds should be released');
    //     assert(
    //         vendor_balance_after == vendor_balance_before + 250, 'vendor should receive payment',
    //     );
    // }

    #[test]
    fn test_submit_review() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let erc20_dispatcher = IERC20Dispatcher { contract_address };
        let vendor = VENDOR();
        let buyer = BUYER();

        // Add product
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Review Product",
                price: 150,
                stock: 5,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );
        stop_cheat_caller_address(contract_address);

        // Complete order cycle
        start_cheat_caller_address(contract_address, buyer);
        erc20_dispatcher.approve(contract_address, 150);
        let order_id = product_dispatcher.place_order(product_id, 1, contract_address);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, vendor);
        product_dispatcher.mark_as_shipped(order_id);
        stop_cheat_caller_address(contract_address);

        start_cheat_caller_address(contract_address, buyer);
        product_dispatcher.confirm_delivery(order_id);
        product_dispatcher.submit_review(order_id, 4, "Great product, fast shipping!");
        stop_cheat_caller_address(contract_address);

        // Verify review
        let reviews = product_dispatcher.get_reviews_by_vendor(vendor);
        assert(reviews.len() == 1, 'review count should be 1');

        let review = reviews.at(0);
        assert(*review.reviewer == buyer, 'reviewer mismatch');
        assert(*review.vendor == vendor, 'vendor mismatch');
        assert(*review.rating == 4, 'rating mismatch');
        assert(product_dispatcher.get_review_count_by_vendor(vendor) == 1, 'review count mismatch');
    }

    // #[test]
    // fn test_full_order_lifecycle() {
    //     let contract_address = setup();
    //     let product_dispatcher = IProductDispatcher { contract_address };
    //     let erc20_dispatcher = IERC20Dispatcher { contract_address };
    //     let vendor = VENDOR();
    //     let buyer = BUYER();

    //     // Add product
    //     start_cheat_caller_address(contract_address, vendor);
    //     let product_id = product_dispatcher
    //         .add_product(
    //             title: "Lifecycle Product",
    //             price: 100,
    //             stock: 10,
    //             video_url: "https://example.com/video",
    //             metadata_uri: "https://example.com/metadata",
    //         );
    //     stop_cheat_caller_address(contract_address);

    //     // Approve and place order
    //     start_cheat_caller_address(contract_address, buyer);
    //     erc20_dispatcher.approve(contract_address, 200);
    //     let order_id = product_dispatcher.place_order(product_id, 2, contract_address);
    //     stop_cheat_caller_address(contract_address);

    //     // Verify order was placed
    //     let order = product_dispatcher.get_order(order_id);
    //     assert(order.buyer == buyer, 'order buyer mismatch');
    //     assert(order.product_id == product_id, 'order product_id mismatch');
    //     assert(order.quantity == 2, 'order quantity mismatch');
    //     assert(order.total == 200, 'order total mismatch');
    //     assert(!order.shipped, 'order should not be shipped');
    //     assert(!order.delivered, 'order should not be delivered');
    //     assert(!order.confirmed, 'order should not be confirmed');
    //     assert(!order.released, 'funds should not be released');

    //     // Mark as shipped (vendor)
    //     start_cheat_caller_address(contract_address, vendor);
    //     product_dispatcher.mark_as_shipped(order_id);
    //     stop_cheat_caller_address(contract_address);

    //     let order = product_dispatcher.get_order(order_id);
    //     assert(order.shipped, 'order should be shipped');
    //     assert(!order.delivered, 'order was delivered earlier');

    //     // Confirm delivery (buyer)
    //     start_cheat_caller_address(contract_address, buyer);
    //     product_dispatcher.confirm_delivery(order_id);
    //     stop_cheat_caller_address(contract_address);

    //     let order = product_dispatcher.get_order(order_id);
    //     assert(order.delivered, 'order should be delivered');
    //     assert(order.confirmed, 'order should be confirmed');
    //     assert(!order.released, 'funds were released earlier');

    //     // Debug: Check balances before release
    //     let vendor_balance_before = erc20_dispatcher.balance_of(vendor);
    //     let contract_balance_before = erc20_dispatcher.balance_of(contract_address);
    //     let buyer_balance_before = erc20_dispatcher.balance_of(buyer);

    //     println!("Vendor balance before release: {}", vendor_balance_before);
    //     println!("Contract balance before release: {}", contract_balance_before);
    //     println!("Buyer balance before release: {}", buyer_balance_before);

    //     // Release funds (vendor) - FIX: Add contract_address parameter like in
    //     test_release_funds start_cheat_caller_address(contract_address, vendor);
    //     product_dispatcher.release_funds(order_id, contract_address);
    //     stop_cheat_caller_address(contract_address);

    //     // Debug: Check balances after release
    //     let vendor_balance_after = erc20_dispatcher.balance_of(vendor);
    //     let contract_balance_after = erc20_dispatcher.balance_of(contract_address);
    //     let buyer_balance_after = erc20_dispatcher.balance_of(buyer);

    //     println!("Vendor balance after release: {}", vendor_balance_after);
    //     println!("Contract balance after release: {}", contract_balance_after);
    //     println!("Buyer balance after release: {}", buyer_balance_after);

    //     let order = product_dispatcher.get_order(order_id);
    //     assert(order.released, 'funds should be released');

    //     // Debug the actual calculation
    //     let expected_vendor_balance = vendor_balance_before + 200;
    //     println!("Expected vendor balance: {}", expected_vendor_balance);
    //     println!("Actual vendor balance: {}", vendor_balance_after);
    //     println!("Difference: {}", vendor_balance_after - vendor_balance_before);

    //     assert(vendor_balance_after == 200, 'vendor should receive payment');
    // }

    #[test]
    fn test_full_product_management() {
        let contract_address = setup();
        let product_dispatcher = IProductDispatcher { contract_address };
        let vendor = VENDOR();

        // Add product
        start_cheat_caller_address(contract_address, vendor);
        let product_id = product_dispatcher
            .add_product(
                title: "Management Product",
                price: 200,
                stock: 15,
                video_url: "https://example.com/video",
                metadata_uri: "https://example.com/metadata",
            );

        // Update product
        product_dispatcher
            .update_product(
                id: product_id,
                title: "Updated Product",
                price: 250,
                stock: 20,
                video_url: "https://example.com/updated-video",
                metadata_uri: "https://example.com/updated-metadata",
            );

        // Verify update
        let product = product_dispatcher.get_product(product_id);
        assert(product.price == 250, 'price should be updated');
        assert(product.stock == 20, 'stock should be updated');

        // Deactivate product
        product_dispatcher.deactivate_product(product_id);
        let product = product_dispatcher.get_product(product_id);
        assert(!product.active, 'product should be deactivated');

        // Reactivate product
        product_dispatcher.activate_product(product_id);
        let product = product_dispatcher.get_product(product_id);
        assert(product.active, 'product should be activated');

        stop_cheat_caller_address(contract_address);
    }
}

