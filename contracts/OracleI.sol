pragma solidity ^0.4.24;

interface OracleI {
    function request(string _url) external returns(bytes32 id);
    function delayedRequest(string _url, uint _delay) external returns(bytes32 id);
    function trustedServer() external returns(address);
}
