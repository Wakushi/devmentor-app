// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DevmentorSessionManagement} from "./DevmentorSessionManagement.sol";
import {DevmentorLib} from "./DevmentorLib.sol";

contract DevmentorCore is DevmentorSessionManagement {
    using DevmentorLib for *;

    // Base sepolia ETH/USD -> 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
    constructor(address _nativeToUsdpriceFeed) DevmentorSessionManagement(_nativeToUsdpriceFeed) {
    }

    // TEST DEV METHOD
    function deleteAccount(address _account) external {
        delete s_studentByAccount[_account];
        delete s_mentorByAccount[_account];
        s_roleByAccount[_account] = DevmentorLib.Role.VISITOR;
    }

    // TEST DEV METHOD
    function resetMentors() external {
        delete s_mentors;
    }

    function getMentor(address _mentorAddress) external view returns (DevmentorLib.Mentor memory) {
        return s_mentorByAccount[_mentorAddress];
    }

    function getStudent(address _studentAddress) external view returns (DevmentorLib.Student memory) {
        return s_studentByAccount[_studentAddress];
    }

    function getSession(uint256 _sessionId) external view returns (DevmentorLib.Session memory) {
        return s_sessions[_sessionId];
    }

    function getAllMentors() external view returns (address[] memory){
        return s_mentors;
    }

    function getSessionCounter() external view returns (uint256) {
        return s_sessionCounter;
    }

    function getRoleByAccount(address _account) external view returns (DevmentorLib.Role){
        return s_roleByAccount[_account];
    }

    function getPendingEarnings(address account) external view returns (uint256) {
        return s_pendingEarningsByAccount[account];
    }
}