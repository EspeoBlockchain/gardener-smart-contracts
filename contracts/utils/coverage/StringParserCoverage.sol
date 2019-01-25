pragma solidity ^0.5.0;

import "../StringParser.sol";

contract StringParserCoverage {
    using StringParser for string;

    function toInt(string memory _x) public pure returns(int) {
        return _x.toInt();
    }

    function toUint(string memory _x) public pure returns(uint) {
        return _x.toUint();
    }

    function substring(string memory _x, uint _startIndex, uint _endIndex) public pure returns(string memory) {
        return _x.substring(_startIndex, _endIndex);
    }

    function concat(string memory _x, string memory _y) public pure returns(string memory) {
        return _x.concat(_y);
    }

    function compare(string memory _x, string memory _y) public pure returns(bool) {
        return _x.compare(_y);
    }

    function indexOf(string memory _x, string memory _needle) public pure returns(int) {
        return _x.indexOf(_needle);
    }
}
