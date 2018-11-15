pragma solidity ^0.4.24;

import "./OracleI.sol";


contract UsingOracle {

    OracleI public oracle;

    mapping(bytes32 => bool) pendingRequests;

    event DataRequestedFromOracle(bytes32 id, string url);
    event DataReadFromOracle(bytes32 id, string value, uint errorCode);

    constructor(OracleI _oracle) public {
        oracle = _oracle;
    }

    function request(string _url) public {
        bytes32 id = oracle.request(_url);
        pendingRequests[id] = true;

        emit DataRequestedFromOracle(id, _url);
    }

    function delayedRequest(string _url, uint _delay) public {
        bytes32 id = oracle.delayedRequest(_url, _delay);
        pendingRequests[id] = true;

        emit DataRequestedFromOracle(id, _url);
    }

    function __callback(bytes32 _id, string _value, uint _errorCode) external onlyFromOracle {
        emit DataReadFromOracle(_id, _value, _errorCode);
    }

    modifier onlyFromOracle() {
        require(msg.sender == address(oracle), "Sender address doesn't equal Oracle");
        _;
    }
}