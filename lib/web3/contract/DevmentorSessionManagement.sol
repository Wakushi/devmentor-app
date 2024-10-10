// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DevmentorLib} from "./DevmentorLib.sol";
import {DevmentorUserManagement} from "./DevmentorUserManagement.sol";
import {DevmentorPaymentHandling} from "./DevmentorPaymentHandling.sol";

contract DevmentorSessionManagement is DevmentorUserManagement, DevmentorPaymentHandling {
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
    error DEVMentor__WrongRating();

    event SessionCreated(address indexed studentAccount, uint256 indexed sessionId);
    event SessionConfirmed(uint256 indexed sessionId, address indexed confirmedBy);
    event SessionCompleted(uint256 indexed sessionId, address indexed mentorAccount, address indexed studentAccount);

     constructor(address _nativeToUsdpriceFeed) DevmentorPaymentHandling(_nativeToUsdpriceFeed) {}

    function createSession(address _mentorAddress, uint256 _startTime, uint256 _endTime, string memory studentContactHash) external payable returns (uint256) {
         if(s_mentorByAccount[_mentorAddress].user.account == address(0)){
            revert Devmentor__MentorNotFound(_mentorAddress);
        }

        if(_startTime >= _endTime || _startTime < block.timestamp){
            revert Devmentor__InvalidSessionTime();
        }

        uint256 hourlyRateUsd = s_mentorByAccount[_mentorAddress].hourlyRate;

        uint256 hourlyRateWei = getHourlyRateInWei(hourlyRateUsd);

        if(hourlyRateWei > 0 && msg.value < hourlyRateWei){
           revert Devmentor__NotEnoughFundsSent();
        }

        uint256 sessionId = s_sessionCounter++;

        s_sessions[sessionId] = DevmentorLib.Session({
            studentContactHash: studentContactHash,
            mentor: _mentorAddress,
            student: msg.sender,
            startTime: _startTime,
            endTime: _endTime,
            valueLocked: msg.value,
            mentorConfirmed: false,
            studentConfirmed: false
        });

        s_sessionIdsByAccount[msg.sender].push(sessionId);
        s_sessionIdsByAccount[_mentorAddress].push(sessionId);

        emit SessionCreated(msg.sender, sessionId);

        return sessionId;
    }

    function confirmSessionAsStudent(uint256 _sessionId, uint256 _rating) external {
         DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (session.student == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (msg.sender != session.student) {
            revert Devmentor__NotAuthorizedToConfirm();
        }

        if (session.studentConfirmed) {
            revert Devmentor__SessionAlreadyConfirmed();
        }

        if (_rating < 0 || _rating > 5) {
            revert DEVMentor__WrongRating();
        }

        DevmentorLib.Mentor storage mentor = s_mentorByAccount[session.mentor];
        mentor.totalRating += _rating;
        ++mentor.sessionCount;

        session.studentConfirmed = true;

        emit SessionConfirmed(_sessionId, msg.sender);
       
        if (session.mentorConfirmed && session.studentConfirmed) {
            _completeSession(_sessionId);
        }
    }

    function confirmSessionAsMentor(uint256 _sessionId) external {
       DevmentorLib.Session storage session = s_sessions[_sessionId];

        if (session.mentor == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (msg.sender != session.mentor) {
            revert Devmentor__NotAuthorizedToConfirm();
        }

        if (session.mentorConfirmed) {
            revert Devmentor__SessionAlreadyConfirmed();
        }

        session.mentorConfirmed = true;

        emit SessionConfirmed(_sessionId, msg.sender);
       
        if (session.mentorConfirmed && session.studentConfirmed) {
            _completeSession(_sessionId);
        }
    }

    function cancelSession(uint256 _sessionId) external {
        // TO IMPLEMENT
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

    function getSessionIdsByAccount(address _account) external view returns(uint256[] memory) {
        return s_sessionIdsByAccount[_account];
    }


}