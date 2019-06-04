pragma solidity ^0.5.0;

interface OracleI {
    function request(string calldata _url) external returns(bytes32 id);
    function delayedRequest(string calldata _url, uint _delay) external returns(bytes32 id);
    function trustedServer() external returns(address);
}
