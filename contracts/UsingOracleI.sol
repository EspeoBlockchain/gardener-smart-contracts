pragma solidity 0.5.9;

interface UsingOracleI {
    function __callback(bytes32 _id, string calldata _value, uint _errorCode) external;
}
