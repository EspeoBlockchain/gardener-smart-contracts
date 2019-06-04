pragma solidity ^0.5.0;

import "./OraclizeI.sol";
import "./UsingOraclizeI.sol";
import "../OracleI.sol";
import "../UsingOracleI.sol";
import "../auth/Authorizable.sol";

contract OraclizeWrapper is OraclizeI, UsingOracleI, Authorizable {

    OracleI public oracle;

    mapping(bytes32 => address) requests;

    constructor(OracleI _oracle) public {
        oracle = _oracle;
        cbAddress = address(this);
    }

    function __callback(bytes32 _id, string calldata _value, uint _errorCode) external {
        address callbackAddress = requests[_id];
        delete requests[_id];

        UsingOraclizeI(callbackAddress).__callback(_id, _value);
    }

    function query(uint _timestamp, string calldata _datasource, string calldata _arg) external payable onlyAuthorized() returns (bytes32 _id) {
        require(keccak256(abi.encodePacked(_datasource)) == keccak256(abi.encodePacked("URL")), "Only URL datasource supported");

        _id = oracle.request(_arg);
        requests[_id] = msg.sender;
    }

    function query_withGasLimit(
        uint _timestamp,
        string calldata _datasource,
        string calldata _arg,
        uint _gaslimit
    ) external payable onlyAuthorized() returns (bytes32 _id) {
        revert("Not implemented");
    }

    function query2(
        uint _timestamp,
        string memory _datasource,
        string memory _arg1,
        string memory _arg2
    ) public payable onlyAuthorized() returns (bytes32 _id) {
        revert("Not implemented");
    }

    function query2_withGasLimit(
        uint _timestamp,
        string calldata _datasource,
        string calldata _arg1,
        string calldata _arg2,
        uint _gaslimit
    ) external payable onlyAuthorized() returns (bytes32 _id) {
        revert("Not implemented");
    }

    function queryN(uint _timestamp, string memory _datasource, bytes memory _argN) public payable onlyAuthorized() returns (bytes32 _id) {
        revert("Not implemented");
    }

    function queryN_withGasLimit(
        uint _timestamp,
        string calldata _datasource,
        bytes calldata _argN,
        uint _gaslimit
    ) external payable onlyAuthorized() returns (bytes32 _id) {
        revert("Not implemented");
    }

    function getPrice(string memory _datasource) public returns (uint _dsprice) {
        return 0;
    }

    function getPrice(string memory _datasource, uint gaslimit) public returns (uint _dsprice) {
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
