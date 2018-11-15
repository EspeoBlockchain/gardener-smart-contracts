pragma solidity ^0.4.24;

import "./OraclizeI.sol";
import "./UsingOraclizeI.sol";
import "../OracleI.sol";
import "../UsingOracleI.sol";

contract OraclizeWrapper is OraclizeI, UsingOracleI {

    OracleI public oracle;

    mapping(bytes32 => address) requests;

    constructor(OracleI _oracle) public {
        oracle = _oracle;
        cbAddress = address(this);
    }

    function __callback(bytes32 _id, string _value, uint _errorCode) external {
        address callbackAddress = requests[_id];
        delete requests[_id];

        UsingOraclizeI(callbackAddress).__callback(_id, _value);
    }

    function query(uint _timestamp, string _datasource, string _arg) external payable returns (bytes32 _id) {
        require(keccak256(abi.encodePacked(_datasource)) == keccak256(abi.encodePacked("URL")), "Only URL datasource supported");

        _id = oracle.request(_arg);
        requests[_id] = msg.sender;
    }

    function query_withGasLimit(uint _timestamp, string _datasource, string _arg, uint _gaslimit) external payable returns (bytes32 _id) {
        revert("Not implemented");
    }

    function query2(uint _timestamp, string _datasource, string _arg1, string _arg2) public payable returns (bytes32 _id) {
        revert("Not implemented");
    }

    function query2_withGasLimit(
        uint _timestamp,
        string _datasource,
        string _arg1,
        string _arg2,
        uint _gaslimit
    ) external payable returns (bytes32 _id) {
        revert("Not implemented");
    }

    function queryN(uint _timestamp, string _datasource, bytes _argN) public payable returns (bytes32 _id) {
        revert("Not implemented");
    }

    function queryN_withGasLimit(uint _timestamp, string _datasource, bytes _argN, uint _gaslimit) external payable returns (bytes32 _id) {
        revert("Not implemented");
    }

    function getPrice(string _datasource) public returns (uint _dsprice) {
        return 0;
    }

    function getPrice(string _datasource, uint gaslimit) public returns (uint _dsprice) {
        return 0;
    }

    function setProofType(byte _proofType) external {
        revert("Not implemented");
    }

    function setCustomGasPrice(uint _gasPrice) external {
        revert("Not implemented");
    }

    function randomDS_getSessionPubKeyHash() external view returns(bytes32) {
        revert("Not implemented");
    }
}
