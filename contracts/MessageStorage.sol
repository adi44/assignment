// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MessageStorage {
    string public message;
    address public owner;

    constructor(string memory __message) payable {
        owner = msg.sender;
        message = __message;
    }

    function setMessage(string calldata __message) external {
        if (owner != msg.sender) {
            revert (
                "msg.sender is not owner"
            );
        }
        message = __message;
    }
}
