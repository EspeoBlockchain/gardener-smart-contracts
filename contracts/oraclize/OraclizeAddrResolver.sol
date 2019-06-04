pragma solidity ^0.5.0;

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

    function changeOwner(address newowner) public onlyOwner {
        owner = newowner;
    }

    function getAddress() public view returns (address oaddr){
        return addr;
    }

    function setAddr(address newaddr) public onlyOwner {
        addr = newaddr;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can change ownership");
        _;
    }

}
