pragma solidity ^0.4.24;

import "../StringParser.sol";

contract StringParserCoverage {
    using StringParser for string;

    function toInt(string _x) public pure returns(int) {
        return _x.toInt();
    }

    function toUint(string _x) public pure returns(uint) {
        return _x.toUint();
    }

    function substring(string _x, uint _startIndex, uint _endIndex) public pure returns(string) {
        return _x.substring(_startIndex, _endIndex);
    }

    function concat(string _x, string _y) public pure returns(string) {
        return _x.concat(_y);
    }

    function compare(string _x, string _y) public pure returns(bool) {
        return _x.compare(_y);
    }

    function indexOf(string _x, string _needle) public pure returns(int) {
        return _x.indexOf(_needle);
    }
}
