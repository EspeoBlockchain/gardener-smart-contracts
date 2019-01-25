pragma solidity ^0.5.3;

interface UsingOraclizeI {
    function __callback(bytes32 _id, string calldata _value) external;
}
