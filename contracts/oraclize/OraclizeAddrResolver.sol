pragma solidity ^0.4.24;

/*
  Copyright (c) 2015-2016 Oraclize SRL
  Copyright (c) 2016 Oraclize LTD
*/

contract OraclizeAddrResolver {

    address public addr;

    address owner;

    constructor() public {
        owner = msg.sender;
    }

    function changeOwner(address newowner) public {
        if (msg.sender != owner) throw;
        owner = newowner;
    }

    function getAddress() public view returns (address oaddr){
        return addr;
    }

    function setAddr(address newaddr) public {
        if (msg.sender != owner) throw;
        addr = newaddr;
    }

}
