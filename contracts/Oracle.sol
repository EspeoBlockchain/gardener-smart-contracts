pragma solidity ^0.4.24;

import "./UsingOracleI.sol";


contract Oracle {
    address public trustedServer;

    uint deadline = now + 2 years;

    mapping(bytes32 => address) pendingRequests;

    event DataRequested(bytes32 id, string url);
    event DelayedDataRequested(bytes32 id, string url, uint delay);
    event RequestFulfilled(bytes32 id, string value);

    constructor(address _trustedServer) public {
        trustedServer = _trustedServer;
    }

    function request(string _url) public returns(bytes32 id) {
        id = keccak256(abi.encodePacked(_url, msg.sender, now));
        pendingRequests[id] = msg.sender;
        emit DataRequested(id, _url);
    }

    function delayedRequest(string _url, uint _delay) public returns(bytes32 id) {
        require(_delay <= 2 years, "Invalid request delay");
        
        id = keccak256(abi.encodePacked(_url, msg.sender, now + _delay));
        pendingRequests[id] = msg.sender;
        emit DelayedDataRequested(id, _url, _delay);
    }

    function fillRequest(bytes32 _id, string _value) external onlyFromTrustedServer {
        require(pendingRequests[_id] != address(0), "Invalid request id");

        address callbackContract = pendingRequests[_id];
        delete pendingRequests[_id];

        UsingOracleI(callbackContract).__callback(_id, _value);

        emit RequestFulfilled(_id, _value);
    }

    modifier onlyFromTrustedServer() {
        require(msg.sender == trustedServer, "Sender address doesn't equal trusted server");
        _;
    }
}
