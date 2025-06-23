use starknet::ContractAddress;

/// @notice Vendor strcut
#[derive(Drop, Serde, starknet::Store)]
pub struct Vendor {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub name: ByteArray,
    pub location: ByteArray,
    pub category: ByteArray,
    pub metadata_uri: ByteArray,
    pub verified: bool,
    pub exists: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

