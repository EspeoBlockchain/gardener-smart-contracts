pragma solidity ^0.4.24;

interface UsingOracleI {
    function __callback(bytes32 _id, string _value) external;
}
