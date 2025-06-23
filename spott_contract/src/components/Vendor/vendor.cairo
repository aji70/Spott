use spott_contract::components::Vendor::interface::IVendor;
#[starknet::component]
pub mod VendorComponent {
    use core::array::{Array, ArrayTrait};
    use spott_contract::components::Vendor::types::Vendor;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

    #[storage]
    pub struct Storage {
        vendors: Map<ContractAddress, Vendor>,
        vendors_written: Map<ContractAddress, bool>,
        total_vendors: u256,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        VendorRegistered: VendorRegistered,
        VendorVerified: VendorVerified,
        VendorUpdated: VendorUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct VendorRegistered {
        #[key]
        vendor: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct VendorVerified {
        #[key]
        vendor: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct VendorUpdated {
        #[key]
        vendor: ContractAddress,
    }

    #[embeddable_as(VendorImpl)]
    impl VendorComponentImpl<
        TContractState, +HasComponent<TContractState>,
    > of super::IVendor<ComponentState<TContractState>> {
        fn register_vendor(
            ref self: ComponentState<TContractState>,
            name: ByteArray,
            location: ByteArray,
            category: ByteArray,
            metadata_uri: ByteArray,
        ) -> u256 {
            assert(name != "", 'Vendor name is empty');
            assert(location != "", 'Vendor location is empty');

            let id = self.total_vendors.read() + 1;
            self.total_vendors.write(id);
            let caller = get_caller_address();
            let exists = self.vendors_written.read(caller);
            assert(!exists, 'Vendor already registered');

            let vendor = Vendor {
                id,
                owner: caller,
                name,
                location,
                category,
                metadata_uri,
                verified: false,
                exists: true,
                created_at: get_block_timestamp(),
                updated_at: get_block_timestamp(),
            };

            self.vendors.write(caller, vendor);
            self.vendors_written.write(caller, true);
            self.emit(VendorRegistered { vendor: caller });

            id
        }
        fn verify_vendor(ref self: ComponentState<TContractState>, vendor: ContractAddress) {
            // Assume you add an `only_admin` check in your implementation
            let mut v = self.vendors.read(vendor);
            v.verified = true;
            self.vendors.write(vendor, v);
            self.emit(VendorVerified { vendor: vendor });
        }
        fn update_vendor_profile(
            ref self: ComponentState<TContractState>,
            name: ByteArray,
            location: ByteArray,
            category: ByteArray,
            metadata_uri: ByteArray,
        ) {
            let caller = get_caller_address();
            let mut vendor = self.vendors.read(caller);
            assert(vendor.owner == caller, 'Not the vendor');

            vendor.name = name;
            vendor.location = location;
            vendor.category = category;
            vendor.metadata_uri = metadata_uri;

            self.vendors.write(caller, vendor);
            self.emit(VendorUpdated { vendor: caller });
        }
        fn is_verified_vendor(
            self: @ComponentState<TContractState>, vendor: ContractAddress,
        ) -> bool {
            let v = self.vendors.read(vendor);
            v.verified
        }
        fn get_vendor(self: @ComponentState<TContractState>, vendor: ContractAddress) -> Vendor {
            self.vendors.read(vendor)
        }
    }
}
