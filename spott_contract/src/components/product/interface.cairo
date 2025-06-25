use spott_contract::components::product::types::{Order, Product, Review};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IProduct<TContractState> {
    fn initialize(ref self: TContractState, payment_token_address: ContractAddress);

    // Product functions
    fn add_product(
        ref self: TContractState,
        title: ByteArray,
        price: u256,
        stock: u256,
        video_url: ByteArray,
        metadata_uri: ByteArray,
    ) -> u256;

    fn update_product(
        ref self: TContractState,
        id: u256,
        title: ByteArray,
        price: u256,
        stock: u256,
        video_url: ByteArray,
        metadata_uri: ByteArray,
    ) -> bool;

    fn get_product(self: @TContractState, id: u256) -> Product;

    fn get_products_by_vendor(self: @TContractState, vendor: ContractAddress) -> Array<Product>;

    fn activate_product(ref self: TContractState, id: u256);

    fn deactivate_product(ref self: TContractState, id: u256);

    // Order functions
    fn place_order(
        ref self: TContractState,
        product_id: u256,
        quantity: u256,
        payment_token_address: ContractAddress,
    ) -> u256;

    fn mark_as_shipped(ref self: TContractState, order_id: u256);

    fn confirm_delivery(ref self: TContractState, order_id: u256);

    fn raise_dispute(ref self: TContractState, order_id: u256);

    fn release_funds(
        ref self: TContractState, order_id: u256, payment_token_address: ContractAddress,
    );

    fn get_order(self: @TContractState, order_id: u256) -> Order;

    // Review functions
    fn submit_review(ref self: TContractState, order_id: u256, rating: u64, comment: ByteArray);

    fn get_reviews_by_vendor(self: @TContractState, vendor: ContractAddress) -> Array<Review>;

    fn get_review_count_by_vendor(self: @TContractState, vendor: ContractAddress) -> u64;

    fn get_product_count(self: @TContractState) -> u256;
}
