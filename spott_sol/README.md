# 🛍️ Spott Smart Contract

**Spott** is a decentralized, map-based live commerce platform enabling vendors to showcase products with videos, get discovered locally, and build trust with customers through reviews and verified profiles. It combines e-commerce, location filtering, and basic escrow logic using Ethereum smart contracts.

---

## 🚀 Features

- ✅ **Vendor Registration**: Includes name, bio, location, images, category, etc.
- ✅ **Vendor Verification**: Done by a moderator using role-based access control.
- ✅ **Product Listings**: Vendors can upload video-based products with pricing and stock.
- ✅ **ETH Checkout**: Buyers pay using `msg.value`, with stock tracking.
- ✅ **Review & Reputation**: Post-delivery reviews build vendor trust.
- ✅ **Location-Based Discovery**: Buyers can browse vendors by city/area.
- ✅ **AccessControl**: Role-based permissions for moderation and management.

---
# 🛍️ Spott Smart Contract

**Spott** is a decentralized marketplace smart contract enabling hyperlocal vendor discovery, video-based product listings, reputation through reviews, and secure ETH payments. It supports vendor registration, moderator verification, location-based search, and simplified order placement — built with mobile-first commerce in mind.

---

## 🧱 Structs Overview

### 👤 `Vendor`

```solidity
struct Vendor {
    uint256 id;
    address owner;
    string name;
    string location;
    string category;
    string metadataUri;
    string bio;
    string profileImage;
    bool verified;
    bool exists;
    uint256 createdAt;
    uint256 updatedAt;
}
```

### 📦 `Product`

```solidity
struct Product {
    uint256 id;
    address vendor;
    string title;
    uint256 price;
    uint256 stock;
    string videoUrl;
    string metadataUri;
    string videoReplayUri;
    bool active;
    string deliveryOption;
}
```

### 🧾 `Order`

```solidity
struct Order {
    uint256 id;
    address buyer;
    uint256 productId;
    uint256 quantity;
    uint256 total;
    bool shipped;
    bool delivered;
    bool confirmed;
    bool released;
    bool disputed;
}
```

### 🌟 `Review`

```solidity
struct Review {
    address reviewer;
    address vendor;
    uint8 rating;
    string comment;
    uint256 timestamp;
}
```

---

## 🔧 Core Functions

### 👥 Vendor

```solidity
registerVendor(...)
verifyVendor(address)
getVendor(address)
getVendorsByLocation(string)
getVendorScore(address)
```

### 🛒 Product

```solidity
addProduct(...)
products(uint256)
```

### 📦 Order

```solidity
placeOrder(productId, quantity) payable
orders(uint256)
```

### ✍️ Review

```solidity
submitReview(orderId, rating, comment)
```

---

## 🔐 Roles & Permissions

This contract uses **OpenZeppelin’s AccessControl** system:

```solidity
DEFAULT_ADMIN_ROLE // Assigned to deployer (moderator)
MODERATOR_ROLE     // Grants permission to verify vendors
```

---

## 🧪 Foundry Usage

### ✅ Install OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### 🔨 Build Contract

```bash
forge build
```

### 🚀 Deploy Contract

```bash
forge create \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  src/Spott.sol:Spott \
  --constructor-args 0xModeratorAddress
```

> Replace `0xModeratorAddress` with the deployer/moderator address.

---

## 🔮 Future Extensions

* ⏳ Escrow logic for staged fund release
* 📹 Real-time livestream commerce
* 🚚 Local delivery and courier integrations
* 🤝 Influencer/vendor delegation (creator marketplaces)
* 🏬 Premium vendor features (ads, analytics, placement)
* 📱 Mobile money and fiat gateway integrations

---

## 📜 License

**MIT License** — Open-source and free to use.

---

## 👨‍💻 Author

Built by [@Ajisabo2](https://github.com/aji70)
Empowering African vendors through trust-first, local-first decentralized commerce.
