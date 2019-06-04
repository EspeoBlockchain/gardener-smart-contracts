pragma solidity 0.5.9;

interface UsingOraclizeI {
    function __callback(bytes32 _id, string calldata _value) external;
}
