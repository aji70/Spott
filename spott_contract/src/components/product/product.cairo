use spott_contract::components::product::interface::IProduct;

#[starknet::component]
pub mod ProductComponent {
    use core::array::{Array, ArrayTrait};
    use core::num::traits::Zero;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use spott_contract::components::product::types::{Order, Product, Review};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address};

    const U64_MAX: u256 = 18446744073709551615_u256;

    #[storage]
    pub struct Storage {
        products: Map<u256, Product>,
        product_count: u256,
        vendor_product_count: Map<ContractAddress, u256>,
        vendor_products: Map<(ContractAddress, u256), u256>,
        orders: Map<u256, Order>,
        order_count: u256,
        buyer_order_count: Map<ContractAddress, u256>,
        buyer_orders: Map<(ContractAddress, u256), u256>,
        vendor_review_count: Map<ContractAddress, u256>,
        vendor_reviews: Map<(ContractAddress, u256), Review>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ProductAdded: ProductAdded,
        ProductUpdated: ProductUpdated,
        ProductActivated: ProductActivated,
        ProductDeactivated: ProductDeactivated,
        OrderPlaced: OrderPlaced,
        OrderShipped: OrderShipped,
        OrderDelivered: OrderDelivered,
        DisputeRaised: DisputeRaised,
        FundsReleased: FundsReleased,
        ReviewSubmitted: ReviewSubmitted,
    }

    #[derive(Drop, starknet::Event)]
    struct ProductAdded {
        #[key]
        product_id: u256,
        #[key]
        vendor: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct ProductUpdated {
        #[key]
        product_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ProductActivated {
        #[key]
        product_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ProductDeactivated {
        #[key]
        product_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct OrderPlaced {
        #[key]
        order_id: u256,
        #[key]
        buyer: ContractAddress,
        product_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct OrderShipped {
        #[key]
        order_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct OrderDelivered {
        #[key]
        order_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct DisputeRaised {
        #[key]
        order_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsReleased {
        #[key]
        order_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ReviewSubmitted {
        #[key]
        vendor: ContractAddress,
        reviewer: ContractAddress,
    }

    #[embeddable_as(ProductImpl)]
    impl ProductComponentImpl<
        TContractState, +HasComponent<TContractState>,
    > of super::IProduct<ComponentState<TContractState>> {
        fn initialize(
            ref self: ComponentState<TContractState>, payment_token_address: ContractAddress,
        ) {
            assert(payment_token_address.is_non_zero(), 'Invalid token address');
        }

        fn add_product(
            ref self: ComponentState<TContractState>,
            title: ByteArray,
            price: u256,
            stock: u256,
            video_url: ByteArray,
            metadata_uri: ByteArray,
        ) -> u256 {
            let caller = get_caller_address();
            let id = self.product_count.read() + 1;
            self.product_count.write(id);

            let product = Product {
                id, vendor: caller, title, price, stock, video_url, metadata_uri, active: true,
            };

            self.products.write(id, product);

            let count = self.vendor_product_count.read(caller);
            self.vendor_products.write((caller, count), id);
            self.vendor_product_count.write(caller, count + 1);

            self.emit(ProductAdded { product_id: id, vendor: caller });
            id
        }

        fn update_product(
            ref self: ComponentState<TContractState>,
            id: u256,
            title: ByteArray,
            price: u256,
            stock: u256,
            video_url: ByteArray,
            metadata_uri: ByteArray,
        ) -> bool {
            let caller = get_caller_address();
            let mut product = self.products.read(id);
            assert(product.vendor == caller, 'Unauthorized');

            product.title = title;
            product.price = price;
            product.stock = stock;
            product.video_url = video_url;
            product.metadata_uri = metadata_uri;

            self.products.write(id, product);
            self.emit(ProductUpdated { product_id: id });
            true
        }

        fn get_product(self: @ComponentState<TContractState>, id: u256) -> Product {
            self.products.read(id)
        }

        fn get_products_by_vendor(
            self: @ComponentState<TContractState>, vendor: ContractAddress,
        ) -> Array<Product> {
            let count = self.vendor_product_count.read(vendor);
            let mut products_arr = ArrayTrait::new();
            let mut i = 0;
            while i < count {
                let product_id = self.vendor_products.read((vendor, i));
                products_arr.append(self.products.read(product_id));
                i += 1;
            }
            products_arr
        }

        fn activate_product(ref self: ComponentState<TContractState>, id: u256) {
            let caller = get_caller_address();
            let mut product = self.products.read(id);
            assert(product.vendor == caller, 'Unauthorized');
            product.active = true;
            self.products.write(id, product);
            self.emit(ProductActivated { product_id: id });
        }

        fn deactivate_product(ref self: ComponentState<TContractState>, id: u256) {
            let caller = get_caller_address();
            let mut product = self.products.read(id);
            assert(product.vendor == caller, 'Unauthorized');
            product.active = false;
            self.products.write(id, product);
            self.emit(ProductDeactivated { product_id: id });
        }

        fn place_order(
            ref self: ComponentState<TContractState>,
            product_id: u256,
            quantity: u256,
            payment_token_address: ContractAddress,
        ) -> u256 {
            let mut product = self.products.read(product_id);
            assert(product.active, 'Product not active');
            assert(product.stock >= quantity, 'Not enough stock');

            let caller = get_caller_address();
            let total = product.price * quantity;

            let token_address = payment_token_address;
            assert(token_address.is_non_zero(), 'Token address not set');
            let token = IERC20Dispatcher { contract_address: token_address };
            token.transfer_from(caller, get_contract_address(), total);

            product.stock -= quantity;
            self.products.write(product_id, product);

            let id = self.order_count.read() + 1;
            self.order_count.write(id);

            let order = Order {
                id,
                buyer: caller,
                product_id,
                quantity,
                total,
                shipped: false,
                delivered: false,
                confirmed: false,
                released: false,
                disputed: false,
            };

            self.orders.write(id, order);

            let count = self.buyer_order_count.read(caller);
            self.buyer_orders.write((caller, count), id);
            self.buyer_order_count.write(caller, count + 1);

            self.emit(OrderPlaced { order_id: id, buyer: caller, product_id });
            id
        }

        fn mark_as_shipped(ref self: ComponentState<TContractState>, order_id: u256) {
            let caller = get_caller_address();
            let mut order = self.orders.read(order_id);
            let product = self.products.read(order.product_id);
            assert(product.vendor == caller, 'Unauthorized');
            order.shipped = true;
            self.orders.write(order_id, order);
            self.emit(OrderShipped { order_id });
        }

        fn confirm_delivery(ref self: ComponentState<TContractState>, order_id: u256) {
            let caller = get_caller_address();
            let mut order = self.orders.read(order_id);
            assert(order.buyer == caller, 'Unauthorized');
            order.delivered = true;
            order.confirmed = true;
            self.orders.write(order_id, order);
            self.emit(OrderDelivered { order_id });
        }

        fn raise_dispute(ref self: ComponentState<TContractState>, order_id: u256) {
            let caller = get_caller_address();
            let mut order = self.orders.read(order_id);
            let product = self.products.read(order.product_id);
            assert(order.buyer == caller || product.vendor == caller, 'Unauthorized');
            assert(!order.released, 'Funds already released');
            order.disputed = true;
            self.orders.write(order_id, order);
            self.emit(DisputeRaised { order_id });
        }

        fn release_funds(
            ref self: ComponentState<TContractState>,
            order_id: u256,
            payment_token_address: ContractAddress,
        ) {
            let caller = get_caller_address();
            let mut order = self.orders.read(order_id);
            let product = self.products.read(order.product_id);
            assert(product.vendor == caller, 'Unauthorized');
            assert(order.confirmed, 'Delivery not confirmed');
            assert(!order.disputed, 'Order is disputed');
            assert(!order.released, 'Funds already released');

            order.released = true;
            self.orders.write(order_id, order);

            let token_address = payment_token_address;
            let token = IERC20Dispatcher { contract_address: token_address };
            token.transfer(product.vendor, order.total);

            self.emit(FundsReleased { order_id });
        }

        fn get_order(self: @ComponentState<TContractState>, order_id: u256) -> Order {
            self.orders.read(order_id)
        }

        fn submit_review(
            ref self: ComponentState<TContractState>,
            order_id: u256,
            rating: u64,
            comment: ByteArray,
        ) {
            let reviewer = get_caller_address();
            let order = self.orders.read(order_id);

            assert(order.buyer == reviewer, 'Not the buyer of order');
            assert(order.confirmed, 'Order not confirmed');

            let product = self.products.read(order.product_id);
            let vendor = product.vendor;

            assert(rating >= 1 && rating <= 5, 'Rating must be 1-5');

            let review = Review {
                reviewer, vendor, rating, comment, timestamp: get_block_timestamp(),
            };

            let count = self.vendor_review_count.read(vendor);
            self.vendor_reviews.write((vendor, count), review);
            self.vendor_review_count.write(vendor, count + 1);

            self.emit(ReviewSubmitted { vendor, reviewer });
        }

        fn get_reviews_by_vendor(
            self: @ComponentState<TContractState>, vendor: ContractAddress,
        ) -> Array<Review> {
            let count = self.vendor_review_count.read(vendor);
            let mut reviews_arr = ArrayTrait::new();
            let mut i = 0;
            while i < count {
                reviews_arr.append(self.vendor_reviews.read((vendor, i)));
                i += 1;
            }
            reviews_arr
        }

        fn get_review_count_by_vendor(
            self: @ComponentState<TContractState>, vendor: ContractAddress,
        ) -> u64 {
            let count: u256 = self.vendor_review_count.read(vendor);
            assert(count <= U64_MAX, 'Count exceeds u64 max');
            count.try_into().expect('Conversion failed')
        }

        fn get_product_count(self: @ComponentState<TContractState>) -> u256 {
            self.product_count.read()
        }
    }
}
