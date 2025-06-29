// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Spott} from "../src/Spott.sol";

contract CounterTest is Test {
    Spott public spott;
    address private moderator = address(0xa);
    address private vendor = address(0xb);

    function setUp() public {
        spott = new Spott(moderator);
    }

    function test_Register_vendor() public {
        vm.startPrank(vendor);
        register_vendor();
        Spott.Vendor memory ven = spott.getVendor(vendor);
        assertEq(ven.id, 1);
        assertEq(ven.owner, vendor);
        assertEq(ven.name, "Vendor1");
        assertEq(ven.location, "Location1");
        assertEq(ven.category, "Category1");
        assertEq(ven.metadataUri, "metadataUri1");
        assertEq(ven.bio, "Bio1");
        assertEq(ven.profileImage, "profileImage1");
        assertTrue(!ven.verified);
        assertTrue(ven.exists);
        vm.stopPrank();
    }

    function test_verify_vendor() public {
        vm.startPrank(vendor);
        register_vendor();
        vm.startPrank(moderator);
        spott.verifyVendor(vendor);
        Spott.Vendor memory ven = spott.getVendor(vendor);
        assertEq(ven.id, 1);
        assertTrue(ven.verified);
        vm.stopPrank();
    }

    function test_add_product() public {
        vm.startPrank(vendor);
        register_vendor();
        spott.addProduct("Product1", 100, 10, "videoUrl1", "metadataUri1", "videoReplayUri1", "DeliveryOption1");
        Spott.Product memory prod = spott.getProduct(1);
        assertEq(prod.id, 1);
        assertEq(prod.vendor, vendor);
        assertEq(prod.title, "Product1");
        assertEq(prod.price, 100);
        assertEq(prod.stock, 10);
        assertEq(prod.videoUrl, "videoUrl1");
        assertEq(prod.metadataUri, "metadataUri1");
        assertEq(prod.videoReplayUri, "videoReplayUri1");
        assertTrue(prod.active);
        assertEq(prod.deliveryOption, "DeliveryOption1");
        vm.stopPrank();
    }

    function test_place_order() public {
        vm.startPrank(vendor);
        register_vendor();
        spott.addProduct("Product1", 100, 10, "videoUrl1", "metadataUri1", "videoReplayUri1", "DeliveryOption1");
        vm.stopPrank();

        vm.startPrank(address(0xc));
        vm.deal(address(0xc), 2000); // Give address(0xc) some ether
        spott.placeOrder{value: 200}(1, 2);
        Spott.Order memory order = spott.getOrder(1);
        assertEq(order.id, 1);
        assertEq(order.buyer, address(0xc));
        assertEq(order.productId, 1);
        assertEq(order.quantity, 2);
        assertEq(order.total, 200);
        assertTrue(order.paid);
        vm.stopPrank();
    }

    function test_ship_order() public {
        vm.startPrank(vendor);
        register_vendor();
        spott.addProduct("Product1", 100, 10, "videoUrl1", "metadataUri1", "videoReplayUri1", "DeliveryOption1");
        vm.stopPrank();

        vm.startPrank(address(0xc));
        vm.deal(address(0xc), 2000); // Give address(0xc) some ether
        spott.placeOrder{value: 200}(1, 2);
        vm.stopPrank();

        vm.startPrank(vendor);
        spott.shipOrder(1);
        Spott.Order memory order = spott.getOrder(1);
        assertTrue(order.shipped);
        vm.stopPrank();
    }

    function test_confirm_order() public {
        vm.startPrank(vendor);
        register_vendor();
        spott.addProduct("Product1", 100, 10, "videoUrl1", "metadataUri1", "videoReplayUri1", "DeliveryOption1");
        vm.stopPrank();

        vm.startPrank(address(0xc));
        vm.deal(address(0xc), 2000); // Give address(0xc) some ether
        spott.placeOrder{value: 200}(1, 2);
        vm.stopPrank();

        vm.startPrank(vendor);
        spott.shipOrder(1);
        vm.stopPrank();

        vm.startPrank(address(0xc));
        spott.confirmOrder(1);
        Spott.Order memory order = spott.getOrder(1);
        assertTrue(order.confirmed);
        vm.stopPrank();
    }

    function register_vendor() public {
        spott.registerVendor("Vendor1", "Location1", "Category1", "metadataUri1", "Bio1", "profileImage1");
    }

    function add_product() public {
        spott.addProduct("Product1", 100, 10, "videoUrl1", "metadataUri1", "videoReplayUri1", "DeliveryOption1");
    }
}
