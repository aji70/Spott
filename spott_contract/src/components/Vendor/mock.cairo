#[starknet::contract]
mod MockVendor {
    use spott_contract::components::Vendor::vendor::VendorComponent;

    component!(path: VendorComponent, storage: vendor_storage, event: VendorEvent);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        vendor_storage: VendorComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        VendorEvent: VendorComponent::Event,
    }


    #[abi(embed_v0)]
    impl VendorImpl = VendorComponent::VendorImpl<ContractState>;
}

