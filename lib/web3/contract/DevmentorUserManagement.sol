// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DevmentorLib} from "./DevmentorLib.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DevmentorUserManagement is Ownable {
    using DevmentorLib for *;

    mapping(address => DevmentorLib.Mentor) internal s_mentorByAccount;
    mapping(address => DevmentorLib.Student) internal s_studentByAccount;
    mapping(address => DevmentorLib.Role) internal s_roleByAccount;
    address[] internal s_mentors;

    error Devmentor__AlreadyRegisteredAsMentor(address account);
    error Devmentor__AlreadyRegisteredAsStudent(address account);
    error Devmentor__NotRegisteredAsStudent(address account);
    error Devmentor__NotRegisteredAsMentor(address account);
    error Devmentor__AddressMismatch();

    event MentorRegistered(address indexed account);
    event StudentRegistered(address indexed account);
    event UpdatedMentorInfo(address indexed account);

    modifier ensureNotRegistered() {
        _ensureNotRegistered();
        _;
    }

    modifier onlyRegisteredStudent() {
        _ensureOnlyRegisteredStudent();
        _;
    }

    modifier onlyRegisteredMentor() {
        _ensureOnlyRegisteredMentor();
        _;
    }

    modifier ensureSameUser(DevmentorLib.BaseUser memory _baserUser) {
        _ensureSameUser(_baserUser);
        _;
    }

    constructor() Ownable(msg.sender) {}

    function registerMentor(
        DevmentorLib.BaseUser memory _baseUser,
        uint256 _yearsOfExperience,
        uint256 _hourlyRate
    ) external ensureSameUser(_baseUser) returns (DevmentorLib.Mentor memory) {
        return _registerMentor(_baseUser, _yearsOfExperience, _hourlyRate);
    }

    function registerMentorAdmin(
        DevmentorLib.BaseUser memory _baseUser,
        uint256 _yearsOfExperience,
        uint256 _hourlyRate
    ) external onlyOwner returns (DevmentorLib.Mentor memory) {
        return _registerMentor(_baseUser, _yearsOfExperience, _hourlyRate);
    }

    function registerStudent(
        DevmentorLib.BaseUser memory _baseUser,
        string memory _contactHash,
        DevmentorLib.Experience _experience
    ) external ensureSameUser(_baseUser) returns (DevmentorLib.Student memory) {
        return _registerStudent(_baseUser, _contactHash, _experience);
    }

    function registerStudentAdmin(
        DevmentorLib.BaseUser memory _baseUser,
        string memory _contactHash,
        DevmentorLib.Experience _experience
    ) external onlyOwner returns (DevmentorLib.Student memory) {
        return _registerStudent(_baseUser, _contactHash, _experience);
    }

    function updateMentorInfo(
        uint256 _yearsOfExperience,
        uint256 _hourlyRate
    ) external onlyRegisteredMentor {
        s_mentorByAccount[msg.sender].yearsOfExperience = _yearsOfExperience;
        s_mentorByAccount[msg.sender].hourlyRate = _hourlyRate;

        emit UpdatedMentorInfo(msg.sender);
    }

    function _registerStudent(
        DevmentorLib.BaseUser memory _baseUser,
        string memory _contactHash,
        DevmentorLib.Experience _experience
    ) internal returns (DevmentorLib.Student memory) {
        DevmentorLib.Student memory newStudent = DevmentorLib.Student({
            user: _baseUser,
            contactHash: _contactHash,
            experience: _experience
        });

        s_roleByAccount[_baseUser.account] = DevmentorLib.Role.STUDENT;
        s_studentByAccount[_baseUser.account] = newStudent;

        emit StudentRegistered(_baseUser.account);

        return newStudent;
    }

    function _registerMentor(
        DevmentorLib.BaseUser memory _baseUser,
        uint256 _yearsOfExperience,
        uint256 _hourlyRate
    ) internal returns (DevmentorLib.Mentor memory) {
        DevmentorLib.Mentor memory newMentor = DevmentorLib.Mentor({
            user: _baseUser,
            yearsOfExperience: _yearsOfExperience,
            hourlyRate: _hourlyRate,
            validated: false,
            sessionCount: 0,
            totalRating: 0
        });

        s_roleByAccount[_baseUser.account] = DevmentorLib.Role.MENTOR;
        s_mentorByAccount[_baseUser.account] = newMentor;
        s_mentors.push(_baseUser.account);

        emit MentorRegistered(_baseUser.account);

        return newMentor;
    }

    function _ensureNotRegistered() internal view {
        if (s_mentorByAccount[msg.sender].user.account != address(0)) {
            revert Devmentor__AlreadyRegisteredAsMentor(msg.sender);
        }

        if (s_studentByAccount[msg.sender].user.account != address(0)) {
            revert Devmentor__AlreadyRegisteredAsStudent(msg.sender);
        }
    }

    function _ensureOnlyRegisteredMentor() internal view {
        if (s_mentorByAccount[msg.sender].user.account == address(0)) {
            revert Devmentor__NotRegisteredAsMentor(msg.sender);
        }
    }

    function _ensureOnlyRegisteredStudent() internal view {
        if (s_studentByAccount[msg.sender].user.account == address(0)) {
            revert Devmentor__NotRegisteredAsStudent(msg.sender);
        }
    }

    function _ensureSameUser(
        DevmentorLib.BaseUser memory _baseUser
    ) internal view {
        if (_baseUser.account != msg.sender) {
            revert Devmentor__AddressMismatch();
        }
    }
}
