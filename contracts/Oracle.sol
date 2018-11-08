pragma solidity ^0.4.24;

import "./UsingOracleI.sol";
import "./auth/Authorizable.sol";


contract Oracle is Authorizable {
    address public trustedServer;

    mapping(bytes32 => address) pendingRequests;

    event DataRequested(bytes32 id, string url);
    event RequestFulfilled(bytes32 id, string value, uint errorCode);

    constructor(address _trustedServer) public {
        trustedServer = _trustedServer;
    }

    function request(string _url) public onlyRole(AUTHORIZED_USER) returns(bytes32 id) {
        id = keccak256(abi.encodePacked(_url, msg.sender, now));
        pendingRequests[id] = msg.sender;
        emit DataRequested(id, _url);
    }

    function fillRequest(bytes32 _id, string _value, uint _errorCode) external onlyFromTrustedServer {
        require(pendingRequests[_id] != address(0), "Invalid request id");

        address callbackContract = pendingRequests[_id];
        delete pendingRequests[_id];

        UsingOracleI(callbackContract).__callback(_id, _value, _errorCode);

        emit RequestFulfilled(_id, _value, _errorCode);
    }

    modifier onlyFromTrustedServer() {
        require(msg.sender == trustedServer, "Sender address doesn't equal trusted server");
        _;
    }
}
