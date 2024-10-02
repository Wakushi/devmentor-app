// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Devmentor {

    enum Subject {
        BLOCKCHAIN,
        SMART_CONTRACTS,
        DEFI,
        NFT,
        WEB3_DEVELOPMENT,
        CRYPTOCURRENCY,
        TOKENOMICS,
        SECURITY,
        DAO
    }

    enum Experience {
        NOVICE,
        BEGINNER,
        INTERMEDIATE,
        ADEPT
    }

    enum Role {
        VISITOR,
        MENTOR,
        STUDENT
    }

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
        string timeslotsHash;
        string reviewsHash;
    }

    struct Student {
       BaseUser user;
       string contactHash;
       Experience experience;
    }

    struct Session {
        string studentContactHash;
        address mentor;
        address student;
        uint256 startTime;
        uint256 endTime;
        uint256 valueLocked;
        bool mentorConfirmed;
        bool studentConfirmed;
    }

    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;

    mapping(address account => Mentor mentor) s_mentorByAccount;
    mapping(address account => Student student) s_studentByAccount;
    mapping(address account => Role role) s_roleByAccount;
    mapping(address account => uint256[] sessionIds) s_sessionIdsByAccount;

    mapping(uint256 => Session) public s_sessions;
    uint256 public s_sessionCounter;
    address[] s_mentors;

    AggregatorV3Interface private s_priceFeed;

    error Devmentor__AlreadyRegisteredAsMentor(address account);
    error Devmentor__AlreadyRegisteredAsStudent(address account);
    error Devmentor__NotRegisteredAsStudent(address account);
    error Devmentor__NotRegisteredAsMentor(address account);
    error Devmentor__MentorNotFound(address mentorAddress);
    error Devmentor__InvalidSessionTime();
    error Devmentor__NotEnoughFundsSent();
    error Devmentor__SessionNotFound(uint256 sessionId);
    error Devmentor__SessionAlreadyConfirmed();
    error Devmentor__NotAuthorizedToConfirm();
    error Devmentor__SessionNotCompleted();
    error Devmentor__FundsTransferFailed();

    event MentorRegistered(address indexed account);
    event StudentRegistered(address indexed account);
    event SessionCreated(address indexed studentAccount, uint256 indexed sessionId);
    event SessionConfirmed(uint256 indexed sessionId, address indexed confirmedBy, bool isMentor);
    event FundsSentToMentor(uint256 indexed sessionId, address indexed mentor, uint256 amount);
    event UpdatedTimeslot(address indexed account);

    modifier ensureNotRegistered(){
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

    // Base sepolia ETH/USD -> 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
    constructor(address _nativeToUsdpriceFeed){
        s_priceFeed = AggregatorV3Interface(_nativeToUsdpriceFeed);
    }

    function registerMentor(
        BaseUser memory _baseUser, 
        uint256 _yearsOfExperience, 
        uint256 _hourlyRate
    ) external ensureNotRegistered returns(Mentor memory mentor)  {
       
       Mentor memory newMentor = Mentor({
            user: _baseUser,
            yearsOfExperience: _yearsOfExperience,
            hourlyRate: _hourlyRate,
            validated: false,
            sessionCount: 0,
            timeslotsHash: "",
            reviewsHash: ""
        });

        s_roleByAccount[msg.sender] = Role.MENTOR;
        s_mentorByAccount[msg.sender] = newMentor;
        s_mentors.push(msg.sender);

        emit MentorRegistered(msg.sender);

        return newMentor;
    }

    function registerStudent(
        BaseUser memory _baseUser,
        string memory _contactHash,
        Experience _experience
    ) external ensureNotRegistered returns (Student memory student){
        
        Student memory newStudent = Student({
            user: _baseUser,
            contactHash: _contactHash,
            experience: _experience
        });

        s_roleByAccount[msg.sender] = Role.STUDENT;
        s_studentByAccount[msg.sender] = newStudent;

         emit StudentRegistered(msg.sender);

        return newStudent;
    }

    function deleteAccount(address _account) external {
        delete s_studentByAccount[_account];
        delete s_mentorByAccount[_account];
        s_roleByAccount[_account] = Role.VISITOR;
    }

    function resetMentors() external {
        delete s_mentors;
    }
    // studentContactHash is encrypted so that only the signature from the mentorAddress can decrypt it
    function createSession(
        address _mentorAddress,
        uint256 _startTime,
        uint256 _endTime,
        string memory studentContactHash
    ) external payable onlyRegisteredStudent returns (uint256) {
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

        s_sessions[sessionId] = Session({
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

    function cancelSession(uint256 _sessionId) external onlyRegisteredStudent {

    }

    function confirmSession(uint256 _sessionId) external {
        Session storage session = s_sessions[_sessionId];
        if (session.mentor == address(0) && session.student == address(0)) {
            revert Devmentor__SessionNotFound(_sessionId);
        }

        if (msg.sender == session.mentor) {
            if (session.mentorConfirmed) {
                revert Devmentor__SessionAlreadyConfirmed();
            }
            session.mentorConfirmed = true;
            emit SessionConfirmed(_sessionId, msg.sender, true);
        } else if (msg.sender == session.student) {
            if (session.studentConfirmed) {
                revert Devmentor__SessionAlreadyConfirmed();
            }
            session.studentConfirmed = true;
            emit SessionConfirmed(_sessionId, msg.sender, false);
        } else {
            revert Devmentor__NotAuthorizedToConfirm();
        }

        if (session.mentorConfirmed && session.studentConfirmed) {
            _completeSession(_sessionId);
        }
    }

    function _completeSession(uint256 _sessionId) internal {
        Session storage session = s_sessions[_sessionId];
        
        if (block.timestamp < session.endTime) {
            revert Devmentor__SessionNotCompleted();
        }

        address payable mentorAddress = payable(session.mentor);
        uint256 amountToSend = session.valueLocked;

        session.valueLocked = 0;

        s_mentorByAccount[session.mentor].sessionCount++;

        (bool success, ) = mentorAddress.call{value: amountToSend}("");

        if (!success) {
            revert Devmentor__FundsTransferFailed();
        }

        emit FundsSentToMentor(_sessionId, session.mentor, amountToSend);
    }

    function updateTimeslot(string memory _timeslotHash) onlyRegisteredMentor external {
        s_mentorByAccount[msg.sender].timeslotsHash = _timeslotHash;

        emit UpdatedTimeslot(msg.sender);
    }

    function getHourlyRateInWei(uint256 _hourlyRateUsd) public view returns(uint256) {
        uint256 hourlyRateUsdPrecision = _hourlyRateUsd * PRECISION;
        uint256 ethPriceUsdPrecision = getEthPrice() * ADDITIONAL_FEED_PRECISION;
        uint256 hourlyRateEth = (hourlyRateUsdPrecision * PRECISION) / ethPriceUsdPrecision;

        return hourlyRateEth;
    }

    function _ensureNotRegistered() internal view {
        if(s_mentorByAccount[msg.sender].user.account != address(0)){
            revert Devmentor__AlreadyRegisteredAsMentor(msg.sender);
        }

       if(s_studentByAccount[msg.sender].user.account != address(0)){
            revert Devmentor__AlreadyRegisteredAsStudent(msg.sender);
       }
    }

    function _ensureOnlyRegisteredMentor() internal view {
        if(s_mentorByAccount[msg.sender].user.account == address(0)){
            revert Devmentor__NotRegisteredAsMentor(msg.sender);
        }
    }

    function _ensureOnlyRegisteredStudent() internal view {
        if(s_studentByAccount[msg.sender].user.account == address(0)){
            revert Devmentor__NotRegisteredAsStudent(msg.sender);
        }
    } 

    function getMentor(address _mentorAddress) external view returns (Mentor memory) {
        return s_mentorByAccount[_mentorAddress];
    }

    function getStudent(address _studentAddress) external view returns (Student memory) {
        return s_studentByAccount[_studentAddress];
    }

    function getSession(uint256 _sessionId) external view returns (Session memory) {
        return s_sessions[_sessionId];
    }

    function getAllMentors() external view returns (address[] memory){
        return s_mentors;
    }

    function getSessionCounter() external view returns (uint256) {
        return s_sessionCounter;
    }

    function getEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = s_priceFeed.latestRoundData();
        return uint256(price);
    }

    function getRoleByAccount(address _account) external view returns (Role){
        return s_roleByAccount[_account];
    }

    function getSessionIdsByAccount(address _account) external view returns(uint256[] memory) {
        return s_sessionIdsByAccount[_account];
    }

}