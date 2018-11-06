pragma solidity ^0.4.24;

import "./OraclizeI.sol";
import "../OracleI.sol";

contract OraclizeWrapper is OraclizeI {

    OracleI public oracle;

    constructor(OracleI _oracle) public {
        oracle = _oracle;
        cbAddress = oracle.trustedServer();
    }

    function query(uint _timestamp, string _datasource, string _arg) external payable returns (bytes32 _id) {
        require(keccak256(abi.encodePacked(_datasource)) == keccak256(abi.encodePacked("URL")), "Only URL datasource supported");

        return oracle.request(_arg);
    }

    function query_withGasLimit(uint _timestamp, string _datasource, string _arg, uint _gaslimit) external payable returns (bytes32 _id) {
        revert();
    }

    function query2(uint _timestamp, string _datasource, string _arg1, string _arg2) public payable returns (bytes32 _id) {
        revert();
    }

    function query2_withGasLimit(uint _timestamp, string _datasource, string _arg1, string _arg2, uint _gaslimit) external payable returns (bytes32 _id) {
       revert();
    }

    function queryN(uint _timestamp, string _datasource, bytes _argN) public payable returns (bytes32 _id) {
        revert();
    }

    function queryN_withGasLimit(uint _timestamp, string _datasource, bytes _argN, uint _gaslimit) external payable returns (bytes32 _id) {
        revert();
    }

    function getPrice(string _datasource) public returns (uint _dsprice) {
        return 0;
    }

    function getPrice(string _datasource, uint gaslimit) public returns (uint _dsprice) {
        return 0;
    }
    function setProofType(byte _proofType) external {
        revert();
    }
    function setCustomGasPrice(uint _gasPrice) external {
        revert();
    }
}
