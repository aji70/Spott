use spott_contract::components::Vendor::types::Vendor;
use starknet::ContractAddress;

#[starknet::interface]
pub trait IVendor<TContractState> {
    // Register a new vendor
    fn register_vendor(
        ref self: TContractState,
        name: ByteArray,
        location: ByteArray,
        category: ByteArray,
        metadata_uri: ByteArray,
    ) -> u256;

    // Admin-only verification of vendor
    fn verify_vendor(ref self: TContractState, vendor: ContractAddress);

    // Update own profile
    fn update_vendor_profile(
        ref self: TContractState,
        name: ByteArray,
        location: ByteArray,
        category: ByteArray,
        metadata_uri: ByteArray,
    );

    // View single vendor profile
    fn get_vendor(self: @TContractState, vendor: ContractAddress) -> Vendor;

    // Check if vendor is verified
    fn is_verified_vendor(self: @TContractState, vendor: ContractAddress) -> bool;
}

