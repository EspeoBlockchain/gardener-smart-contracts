pragma solidity ^0.5.0;

import "./UsingOracleI.sol";
import "./auth/Authorizable.sol";


contract Oracle is Authorizable {

    struct Request {
        address requestAddress;
        uint validFrom;
    }

    address public trustedServer;

    /**
     * @dev A unix timestamp (epoch seconds) differentiating delayed requests.
     *      Delay values greater than LIMIT_DATE are considered timestamps.
     *      Delay values smaller or equal than LIMIT_DATE are considered delays given in seconds.
     *      No delay can be bigger than 2 years.
     *      LIMIT_DATE value is 2018/01/01 00:00:00 GMT.
     */
    uint constant LIMIT_DATE = 1514764800;
    uint constant YEAR = 365 days;

    mapping(bytes32 => Request) pendingRequests;

    event DataRequested(bytes32 indexed id, string url);
    event DelayedDataRequested(bytes32 indexed id, string url, uint validFrom);
    event RequestFulfilled(bytes32 indexed id, string value, uint errorCode);

    constructor(address _trustedServer) public {
        trustedServer = _trustedServer;
    }

    function request(string memory _url) public onlyAuthorized returns(bytes32 id) {
        id = keccak256(abi.encodePacked(_url, msg.sender, now));
        pendingRequests[id].requestAddress = msg.sender;
        pendingRequests[id].validFrom = now;
        emit DataRequested(id, _url);
    }

    function delayedRequest(string memory _url, uint _delay) public returns(bytes32 id) {
        if (_delay > LIMIT_DATE) {
            require(_delay - now <= 2 * YEAR, "Invalid request timestamp delay");
            id = keccak256(abi.encodePacked(_url, msg.sender, _delay));
            pendingRequests[id].requestAddress = msg.sender;
            pendingRequests[id].validFrom = _delay;
            emit DelayedDataRequested(id, _url, pendingRequests[id].validFrom);
        } else {
            require(_delay <= 2 * YEAR, "Invalid request delay");
            id = keccak256(abi.encodePacked(_url, msg.sender, now, _delay));
            pendingRequests[id].requestAddress = msg.sender;
            pendingRequests[id].validFrom = now + _delay;
            emit DelayedDataRequested(id, _url, pendingRequests[id].validFrom);
        }
    }

    function fillRequest(bytes32 _id, string calldata _value, uint _errorCode) external
    onlyFromTrustedServer onlyIfValidRequestId(_id) onlyIfValidTimestamp(_id) {
        address callbackContract = pendingRequests[_id].requestAddress;
        delete pendingRequests[_id];

        UsingOracleI(callbackContract).__callback(_id, _value, _errorCode);

        emit RequestFulfilled(_id, _value, _errorCode);
    }

    modifier onlyFromTrustedServer() {
        require(msg.sender == trustedServer, "Sender address doesn't equal trusted server");
        _;
    }

    modifier onlyIfValidRequestId(bytes32 _id) {
        require(pendingRequests[_id].requestAddress != address(0), "Invalid request id");
        _;
    }

    modifier onlyIfValidTimestamp(bytes32 _id) {
        require(pendingRequests[_id].validFrom <= now, "Invalid request delay as timestamp");
        _;
    }
}
