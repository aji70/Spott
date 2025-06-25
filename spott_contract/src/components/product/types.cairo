use starknet::ContractAddress;

// Product struct
#[derive(Drop, Serde, starknet::Store)]
pub struct Product {
    pub id: u256,
    pub vendor: ContractAddress,
    pub title: ByteArray,
    pub price: u256,
    pub stock: u256,
    pub video_url: ByteArray,
    pub metadata_uri: ByteArray,
    pub active: bool,
}

// Order struct
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Order {
    pub id: u256,
    pub buyer: ContractAddress,
    pub product_id: u256,
    pub quantity: u256,
    pub total: u256,
    pub shipped: bool,
    pub delivered: bool,
    pub confirmed: bool,
    pub released: bool,
    pub disputed: bool,
}

// Review struct
#[derive(Drop, Serde, starknet::Store)]
pub struct Review {
    pub reviewer: ContractAddress,
    pub vendor: ContractAddress,
    pub rating: u64,
    pub comment: ByteArray,
    pub timestamp: u64,
}
