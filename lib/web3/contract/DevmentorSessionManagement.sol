// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DevmentorLib} from "./DevmentorLib.sol";
import {DevmentorUserManagement} from "./DevmentorUserManagement.sol";
import {DevmentorPaymentHandling} from "./DevmentorPaymentHandling.sol";

contract DevmentorSessionManagement is
    DevmentorUserManagement,
    DevmentorPaymentHandling
{
    using DevmentorLib for *;

    mapping(uint256 => DevmentorLib.Session) public s_sessions;
    mapping(address => uint256[]) private s_sessionIdsByAccount;
    uint256 public s_sessionCounter;

    error Devmentor__MentorNotFound(address mentorAddress);
    error Devmentor__InvalidSessionTime();
    error Devmentor__NotEnoughFundsSent();
    error Devmentor__SessionNotFound(uint256 sessionId);
    error Devmentor__SessionAlreadyConfirmed();
    error Devmentor__NotAuthorizedToConfirm();
    error Devmentor__SessionNotCompleted();
    error Devmentor__WrongRating();
    error Devmentor__NotAuthorizedForValidation();

    event SessionCreated(
        address indexed studentAccount,
        uint256 indexed sessionId
    );
    event SessionConfirmed(
        uint256 indexed sessionId,
        address indexed confirmedBy
    );
    event SessionCompleted(
        uint256 indexed sessionId,
        address indexed mentorAccount,
        address indexed studentAccount
    );
    event SessionValidated(
        uint256 indexed sessionId,
        address indexed mentorAccount,
        bool indexed accepted
    );

    constructor(
        address _nativeToUsdpriceFeed
    ) DevmentorPaymentHandling(_nativeToUsdpriceFeed) {}

    function createSession(
        address _mentorAddress,
        uint256 _startTime,
        uint256 _endTime,
        string memory _studentContactHash,
        string memory _sessionGoalHash,
        string memory _topic
    ) external payable onlyRegisteredStudent returns (uint256) {
        return
            _createSession(
                msg.sender,
                _mentorAddress,
                _startTime,
                _endTime,
                _studentContactHash,
                _sessionGoalHash,
                _topic
            );
    }

    function createSessionAdmin(
        address _studentAddress,
        address _mentorAddress,
        uint256 _startTime,
        uint256 _endTime,
        string memory _studentContactHash,
        string memory _sessionGoalHash,
        string memory _topic
    ) external onlyOwner returns (uint256) {
        return
            _createSession(
                _studentAddress,
                _mentorAddress,
                _startTime,
                _endTime,
                _studentContactHash,
                _sessionGoalHash,
                _topic
            );
    }

    function confirmSessionAsStudent(
        uint256 _sessionId,
        uint256 _rating
    ) external onlyRegisteredStudent {
        _confirmSessionAsStudent(msg.sender, _sessionId, _rating);
    }

    function confirmSessionAsStudentAdmin(
        address _studentAddress,
        uint256 _sessionId,
        uint256 _rating
    ) external onlyOwner {
        _confirmSessionAsStudent(_studentAddress, _sessionId, _rating);
    }

    function confirmSessionAsMentor(
        uint256 _sessionId
    ) external onlyRegisteredMentor {
        _confirmSessionAsMentor(msg.sender, _sessionId);
    }

    function confirmSessionAsMentorAdmin(
        address _mentorAddress,
        uint256 _sessionId
    ) external onlyOwner {
        _confirmSessionAsMentor(_mentorAddress, _sessionId);
    }

    function acceptSession(uint256 _sessionId, bool _accepted) external onlyRegisteredMentor {
        _acceptSession(msg.sender, _sessionId, _accepted);
    }

    function acceptSessionAdmin(address _mentorAddress, uint256 _sessionId, bool _accepted) external onlyOwner {
        _acceptSession(_mentorAddress, _sessionId, _accepted);
    }

    function cancelSession(uint256 _sessionId) external {
        // TO SPECIFY AND IMPLEMENT
    }

    function _confirmSessionAsMentor(
        address _mentorAddress,
        uint256 _sessionId
    ) internal {
        DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (session.mentor == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (_mentorAddress != session.mentor) {
            revert Devmentor__NotAuthorizedToConfirm();
        }

        if (session.mentorConfirmed) {
            revert Devmentor__SessionAlreadyConfirmed();
        }

        session.mentorConfirmed = true;

        emit SessionConfirmed(_sessionId, _mentorAddress);

        if (session.mentorConfirmed && session.studentConfirmed) {
            _completeSession(_sessionId);
        }
    }

    function _createSession(
        address _studentAddress,
        address _mentorAddress,
        uint256 _startTime,
        uint256 _endTime,
        string memory _studentContactHash,
        string memory _sessionGoalHash,
        string memory _topic
    ) internal returns (uint256) {
        if (s_mentorByAccount[_mentorAddress].user.account == address(0)) {
            revert Devmentor__MentorNotFound(_mentorAddress);
        }

        if (_startTime >= _endTime || _startTime < block.timestamp) {
            revert Devmentor__InvalidSessionTime();
        }

        uint256 hourlyRateUsd = s_mentorByAccount[_mentorAddress].hourlyRate;
        uint256 hourlyRateWei = 0;

        if (hourlyRateUsd > 0) {
            hourlyRateWei = getHourlyRateInWei(hourlyRateUsd);
        }

        if (hourlyRateWei > 0 && msg.value < hourlyRateWei) {
            revert Devmentor__NotEnoughFundsSent();
        }

        uint256 sessionId = s_sessionCounter++;

        s_sessions[sessionId] = DevmentorLib.Session({
            studentContactHash: _studentContactHash,
            sessionGoalHash: _sessionGoalHash,
            mentor: _mentorAddress,
            student: _studentAddress,
            startTime: _startTime,
            endTime: _endTime,
            valueLocked: msg.value,
            mentorConfirmed: false,
            studentConfirmed: false,
            accepted: false,
            topic: _topic
        });

        s_sessionIdsByAccount[_studentAddress].push(sessionId);
        s_sessionIdsByAccount[_mentorAddress].push(sessionId);

        emit SessionCreated(_studentAddress, sessionId);

        return sessionId;
    }

    function _confirmSessionAsStudent(
        address _studentAddress,
        uint256 _sessionId,
        uint256 _rating
    ) internal {
        DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (session.student == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (_studentAddress != session.student) {
            revert Devmentor__NotAuthorizedToConfirm();
        }

        if (session.studentConfirmed) {
            revert Devmentor__SessionAlreadyConfirmed();
        }

        if (_rating < 0 || _rating > 5) {
            revert Devmentor__WrongRating();
        }

        DevmentorLib.Mentor storage mentor = s_mentorByAccount[session.mentor];
        mentor.totalRating += _rating;
        ++mentor.sessionCount;

        session.studentConfirmed = true;

        emit SessionConfirmed(_sessionId, _studentAddress);

        if (session.mentorConfirmed && session.studentConfirmed) {
            _completeSession(_sessionId);
        }
    }

    function _completeSession(uint256 _sessionId) internal {
        DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (block.timestamp < session.endTime) {
            revert Devmentor__SessionNotCompleted();
        }

        address payable mentorAddress = payable(session.mentor);
        uint256 amountToSend = session.valueLocked;

        session.valueLocked = 0;

        s_mentorByAccount[session.mentor].sessionCount++;

        (bool success, ) = mentorAddress.call{value: amountToSend}("");

        if (!success) {
            s_pendingEarningsByAccount[session.mentor] += amountToSend;

            emit PaymentPending(session.mentor, amountToSend);
        } else {
            emit FundsSentToMentor(_sessionId, session.mentor, amountToSend);
        }

        emit SessionCompleted(_sessionId, session.mentor, session.student);
    }

    function _acceptSession(address _mentorAddress, uint256 _sessionId, bool _accepted) internal {
        DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (session.mentor == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (_mentorAddress != session.mentor) {
            revert Devmentor__NotAuthorizedForValidation();
        }

        session.accepted = _accepted;

        emit SessionValidated(_sessionId, _mentorAddress, _accepted);
    }

    function getSessionIdsByAccount(
        address _account
    ) external view returns (uint256[] memory) {
        return s_sessionIdsByAccount[_account];
    }
}
