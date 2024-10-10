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
        if (_baseUser.account != msg.sender) {
            revert Devmentor__AddressMismatch();
        }

        DevmentorLib.Mentor memory newMentor = DevmentorLib.Mentor({
            user: _baseUser,
            yearsOfExperience: _yearsOfExperience,
            hourlyRate: _hourlyRate,
            validated: false,
            sessionCount: 0,
            totalRating: 0
        });

        s_roleByAccount[msg.sender] = DevmentorLib.Role.MENTOR;
        s_mentorByAccount[msg.sender] = newMentor;
        s_mentors.push(msg.sender);

        emit MentorRegistered(msg.sender);

        return newMentor;
    }

    function registerStudent(
        DevmentorLib.BaseUser memory _baseUser,
        string memory _contactHash,
        DevmentorLib.Experience _experience
    ) external ensureSameUser(_baseUser) returns (DevmentorLib.Student memory) {
        DevmentorLib.Student memory newStudent = DevmentorLib.Student({
            user: _baseUser,
            contactHash: _contactHash,
            experience: _experience
        });

        s_roleByAccount[msg.sender] = DevmentorLib.Role.STUDENT;
        s_studentByAccount[msg.sender] = newStudent;

        emit StudentRegistered(msg.sender);

        return newStudent;
    }

    function registerMentorAdmin(
        DevmentorLib.BaseUser memory _baseUser,
        uint256 _yearsOfExperience,
        uint256 _hourlyRate
    ) external onlyOwner returns (DevmentorLib.Mentor memory) {
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

    function registerStudentAdmin(
        DevmentorLib.BaseUser memory _baseUser,
        string memory _contactHash,
        DevmentorLib.Experience _experience
    ) external onlyOwner returns (DevmentorLib.Student memory) {
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
