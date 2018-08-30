pragma solidity ^0.4.24;

import "./OracleI.sol";


contract UsingOracle {

    OracleI public oracle;

    mapping(bytes32 => bool) pendingRequests;

    event DataRequestedFromOracle(bytes32 id, string url);
    event DataReadFromOracle(bytes32 id, string value);

    constructor(OracleI _oracle) public {
        oracle = _oracle;
    }

    function request(string _url) public {
        bytes32 id = oracle.request(_url);
        pendingRequests[id] = true;

        emit DataRequestedFromOracle(id, _url);
    }

    function __callback(bytes32 _id, string _value) external onlyFromOracle {
        require(pendingRequests[_id], "Invalid request id");
        delete pendingRequests[_id];

        emit DataReadFromOracle(_id, _value);
    }

    modifier onlyFromOracle() {
        require(msg.sender == address(oracle), "Sender address doesn't equal Oracle");
        _;
    }
}
