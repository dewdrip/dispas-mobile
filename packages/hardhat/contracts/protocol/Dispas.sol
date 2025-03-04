// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IDispas } from "../interfaces/IDispas.sol";
import { DataTypes } from "./libraries/DataTypes.sol";

/**
 * @title Dispas - A Gas-Efficient LYX Distributor
 * @author Valentine Orga
 * @notice This contract allows users to split LYX payments among multiple recipients.
 * @dev Uses a single loop for efficiency, calldata structs to minimize gas, and robust error handling.
 */
contract Dispas is IDispas {
    // ==========================
    // Errors
    // ==========================
    error Dispas__ZeroAddress();
    error Dispas__ZeroAmount();
    error Dispas__InsufficientValue();
    error Dispas__TransferFailed(address recipient, uint256 amount);

    // ==========================
    // Functions
    // ==========================

    /// @inheritdoc IDispas
    function distributeFunds(DataTypes.Payment[] calldata payments) external payable {
        uint256 distributedAmount = 0;
        uint256 paymentsLength = payments.length;

        for (uint256 i = 0; i < paymentsLength; i++) {
            DataTypes.Payment calldata payment = payments[i];

            // validate input
            require(payment.recipient != address(0), Dispas__ZeroAddress());
            require(payment.amount != 0, Dispas__ZeroAmount());

            // track total distribution
            distributedAmount += payment.amount;

            // ensure distributed amount does not exceed the full msg.value
            if (distributedAmount > msg.value) revert Dispas__InsufficientValue();

            // attempt transfer
            (bool success, ) = payment.recipient.call{ value: payment.amount }("");
            require(success, Dispas__TransferFailed(payment.recipient, payment.amount));
        }

        // emit event for overall distribution
        emit FundsDistributed(msg.sender, msg.value);
    }

    /// @dev Fallback function to prevent accidental LYX deposits.
    receive() external payable {
        revert("Direct deposits not allowed");
    }
}
