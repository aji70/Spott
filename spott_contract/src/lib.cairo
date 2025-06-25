pub mod components {
    pub mod Vendor {
        pub mod interface;
        pub mod mock;
        pub mod test;
        pub mod types;
        pub mod vendor;
    }
    pub mod product {
        pub mod MockProduct;
        pub mod interface;
        pub mod product;
        pub mod test;
        pub mod types;
    }
}
pub mod interfaces {
    pub mod ierc20;
}
