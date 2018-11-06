pragma solidity ^0.4.24;

interface OracleI {
    function request(string _url) external returns(bytes32 id);
}
