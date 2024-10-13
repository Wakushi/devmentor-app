// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library DevmentorLib {
    enum Subject { BLOCKCHAIN, SMART_CONTRACTS, DEFI, NFT, WEB3_DEVELOPMENT, CRYPTOCURRENCY, TOKENOMICS, SECURITY, DAO }
    enum Experience { NOVICE, BEGINNER, INTERMEDIATE, ADEPT }
    enum Role { VISITOR, MENTOR, STUDENT }

    struct BaseUser {
        address account;
        string userName;
        uint8[] languages;
        Subject[] subjects;
    }

    struct Mentor {
        BaseUser user;
        bool validated;
        uint256 yearsOfExperience;
        uint256 sessionCount;
        uint256 hourlyRate;
        uint256 totalRating;
    }

    struct Student {
        BaseUser user;
        string contactHash;
        Experience experience;
    }

    struct Session {
        string studentContactHash;
        string sessionGoalHash;
        address mentor;
        address student;
        uint256 startTime;
        uint256 endTime;
        uint256 valueLocked;
        bool accepted;
        bool mentorConfirmed;
        bool studentConfirmed;
    }
}