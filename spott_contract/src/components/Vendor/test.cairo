#[cfg(test)]
mod tests {
    use snforge_std::{
        ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
        stop_cheat_caller_address,
    };
    use spott_contract::components::Vendor::interface::{IVendorDispatcher, IVendorDispatcherTrait};
    use spott_contract::components::Vendor::types::Vendor;
    use starknet::ContractAddress;

    fn setup() -> ContractAddress {
        let declare_result = declare("MockVendor");
        assert(declare_result.is_ok(), 'Contract declaration failed');

        let contract_class = declare_result.unwrap().contract_class();
        let mut calldata = array![];
        let (contract_address, _) = contract_class.deploy(@calldata).unwrap();

        contract_address
    }

    #[test]
    fn test_register_vendor() {
        let contract_address = setup();
        let dispatcher = IVendorDispatcher { contract_address };

        let owner: ContractAddress = 12345.try_into().unwrap();

        let name: ByteArray = "Pablo";
        let location: ByteArray = "yabadaba";
        let category = "Pet Store";
        let metadata_uri: ByteArray = "https://example.com/metadata";

        start_cheat_caller_address(contract_address, owner);
        let vendor_id = dispatcher.register_vendor(name, location, category, metadata_uri);

        stop_cheat_caller_address(owner);

        assert(vendor_id == 1, 'vendor_id should start from 1');

        let vendor = dispatcher.get_vendor(owner);

        assert(vendor.name == "Pablo", 'name mismatch');
        assert(vendor.location == "yabadaba", 'location mismatch');
        assert(vendor.category == "Pet Store", 'category mismatch');
        assert(vendor.metadata_uri == "https://example.com/metadata", 'metadata_uri mismatch');
    }
}
