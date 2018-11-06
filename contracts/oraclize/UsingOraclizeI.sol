pragma solidity ^0.4.24;

interface UsingOraclizeI {
    function __callback(bytes32 _id, string _value) external;
}
