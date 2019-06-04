pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";


contract Authorizable is Ownable {

    using Roles for Roles.Role;
    Roles.Role private _authorized;


    function grantAccessToAddress(address _authorizedAddress) public onlyOwner {
        _authorized.add(_authorizedAddress);
    }

    function revokeAccessFromAddress(address _addressToRevoke) public onlyOwner {
        _authorized.remove(_addressToRevoke);
    }

    function isAuthorized(address _checkingAddress) public view returns(bool) {
        return _authorized.has(_checkingAddress);
    }

    modifier onlyAuthorized() {
        require(_authorized.has(msg.sender), "Only authorized addresses can perform this action");
        _;
    }
}
