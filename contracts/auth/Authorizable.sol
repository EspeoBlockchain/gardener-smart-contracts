pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/rbac/RBAC.sol";


contract Authorizable is Ownable, RBAC {

    string public constant AUTHORIZED_ROLE = "authorized_role";

    function grantAccessToAddress(address _authorizedAddress) public onlyOwner {
        addRole(_authorizedAddress, AUTHORIZED_ROLE);
    }

    function revokeAccessFromAddress(address _addressToRevoke) public onlyOwner {
        removeRole(_addressToRevoke, AUTHORIZED_ROLE);
    }
}
