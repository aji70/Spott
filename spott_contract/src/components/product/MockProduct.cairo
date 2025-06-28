// SPDX-License-Identifier: MIT
use starknet::ContractAddress;

#[starknet::interface]
pub trait IExternal<ContractState> {
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256);
    fn internal_transfer(ref self: ContractState, to: ContractAddress, amount: u256) -> bool;
}
#[starknet::contract]
pub mod MockProduct {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::IERC20Metadata;
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use spott_contract::components::product::product::ProductComponent;
    use starknet::ContractAddress;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ProductComponent, storage: product, event: ProductEvent);

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub erc20: ERC20Component::Storage,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pub product: ProductComponent::Storage,
        custom_decimals: u8 // Add custom decimals storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ProductEvent: ProductComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.erc20.initializer(format!("USDC"), format!("USDC"));
        self.ownable.initializer(owner);
        self.custom_decimals.write(8);
        // Initialize the product component with the contract's own address as payment token
        self.product.initialize(starknet::get_contract_address());
    }

    #[abi(embed_v0)]
    impl CustomERC20MetadataImpl of IERC20Metadata<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc20.name()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.erc20.symbol()
        }

        fn decimals(self: @ContractState) -> u8 {
            self.custom_decimals.read() // Return custom value
        }
    }

    // Keep existing implementations
    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ProductImpl = ProductComponent::ProductImpl<ContractState>;

    #[abi(embed_v0)]
    impl ExternalImpl of super::IExternal<ContractState> {
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.erc20.mint(recipient, amount);
        }
        fn internal_transfer(ref self: ContractState, to: ContractAddress, amount: u256) -> bool {
            // Used the ERC20 internal implementation to transfer from contract's balance to
            // recipient
            let contract_address = starknet::get_contract_address();
            self.erc20._transfer(contract_address, to, amount);
            true
        }
    }
}
