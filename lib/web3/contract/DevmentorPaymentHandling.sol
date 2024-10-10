// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract DevmentorPaymentHandling {
    mapping(address account => uint256 pendingEarnings) s_pendingEarningsByAccount;
    AggregatorV3Interface private s_priceFeed;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;

    error Devmentor__FundsTransferFailed();

    event FundsSentToMentor(
        uint256 indexed sessionId,
        address indexed mentor,
        uint256 amount
    );
    event PaymentPending(address indexed account, uint256 indexed amount);
    event PendingPaymentResolved(
        address indexed account,
        uint256 indexed amount
    );

    constructor(address _nativeToUsdpriceFeed) {
        s_priceFeed = AggregatorV3Interface(_nativeToUsdpriceFeed);
    }

    function resolvePendingPayment() external {
        uint256 pendingAmount = s_pendingEarningsByAccount[msg.sender];

        s_pendingEarningsByAccount[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: pendingAmount}("");

        if (!success) {
            revert Devmentor__FundsTransferFailed();
        }

        emit PendingPaymentResolved(msg.sender, pendingAmount);
    }

    function getHourlyRateInWei(
        uint256 _hourlyRateUsd
    ) public view returns (uint256) {
        uint256 hourlyRateUsdPrecision = _hourlyRateUsd * PRECISION;
        uint256 ethPriceUsdPrecision = getEthPrice() *
            ADDITIONAL_FEED_PRECISION;
        uint256 hourlyRateEth = (hourlyRateUsdPrecision * PRECISION) /
            ethPriceUsdPrecision;

        return hourlyRateEth;
    }

    function getEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = s_priceFeed.latestRoundData();
        return uint256(price);
    }
}
