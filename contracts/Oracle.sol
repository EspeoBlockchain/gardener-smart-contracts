pragma solidity ^0.4.24;

import "./UsingOracleI.sol";


contract Oracle {
    address public trustedServer;

    struct Request { 
        address requestAddress;  
        uint validFrom;
        uint delay;  
    }

    uint constant LIMIT_DATE = 1541150945;

    bytes32[] public requests;

    mapping(bytes32 => Request) pendingRequests;

    event DataRequested(bytes32 id, string url);
    event DelayedDataRequested(bytes32 id, string url, uint delay);
    event RequestFulfilled(bytes32 id, string value);

    constructor(address _trustedServer) public {
        trustedServer = _trustedServer;
    }

    function request(string _url) public returns(bytes32 id) {
        id = keccak256(abi.encodePacked(_url, msg.sender, now));
        pendingRequests[id].requestAddress = msg.sender;
        pendingRequests[id].validFrom = now;
        pendingRequests[id].delay = 0;
        requests.push(id);
        emit DataRequested(id, _url);
    }

    function delayedRequest(string _url, uint _delay) public returns(bytes32 id) {
        if (_delay > LIMIT_DATE) {
            require(_delay <= 4102444800, "Invalid request timestamp delay");
            uint newNow = _delay;
            id = keccak256(abi.encodePacked(_url, msg.sender, newNow));
            pendingRequests[id].requestAddress = msg.sender;
            pendingRequests[id].validFrom = newNow;
            pendingRequests[id].delay = 0;
            requests.push(id);
            emit DelayedDataRequested(id, _url, newNow);
        } else {
            require(_delay <= 2 years, "Invalid request delay");
            id = keccak256(abi.encodePacked(_url, msg.sender, _delay, now));
            pendingRequests[id].requestAddress = msg.sender;
            pendingRequests[id].validFrom = now;
            pendingRequests[id].delay = _delay;
            requests.push(id);
            emit DelayedDataRequested(id, _url, _delay);
        }
    }

    function fillRequest(bytes32 _id, string _value) external onlyFromTrustedServer {
        require(pendingRequests[_id].requestAddress != address(0), "Invalid request id");

        address callbackContract = pendingRequests[_id].requestAddress;
        delete pendingRequests[_id];

        UsingOracleI(callbackContract).__callback(_id, _value);

        emit RequestFulfilled(_id, _value);
    }

    modifier onlyFromTrustedServer() {
        require(msg.sender == trustedServer, "Sender address doesn't equal trusted server");
        _;
    }
}
