pragma solidity ^0.5.0;

library StringParser {
    function toInt(string memory _x) public pure returns(int) {
        bytes memory _xInBytes = bytes(_x);
        if(_xInBytes[0] == "-") {
            uint result = toUint(substring(_x, 1, _xInBytes.length));

            return -1 * int(result);
        }

        return int(toUint(_x));
    }

    function toUint(string memory _x) public pure returns(uint) {
        uint power = 0;
        uint base = 10;
        uint result = 0;
        uint dotOccurence = 0;
        uint precision = 0;
        bytes memory _xInBytes = bytes(_x);

        for(uint i = _xInBytes.length; i > 0; i--) {
            if (_xInBytes[i-1] == ".") {
                dotOccurence += 1;
                require(dotOccurence < 2, "Only one dot can be in string");
                precision = _xInBytes.length-i;
            } else {
                uint digit = (uint8(_xInBytes[i-1]) - 48);
                require(digit >= 0 && digit <= 9, "Character is not a digit");
                result += digit * base ** power;
                power += 1;
            }
        }

        return result/base**precision;
    }

    function substring(string memory _x, uint _startIndex, uint _endIndex) public pure returns(string memory) {
        bytes memory _xInBytes = bytes(_x);
        bytes memory result = new bytes(_endIndex-_startIndex);
        for(uint i = _startIndex; i < _endIndex; i++) {
            result[i-_startIndex] = _xInBytes[i];
        }

        return string(result);
    }

    function concat(string memory _x, string memory _y) public pure returns(string memory) {
        bytes memory _xInBytes = bytes(_x);
        bytes memory _yInBytes = bytes(_y);
        bytes memory result = new bytes(_xInBytes.length + _yInBytes.length);

        for(uint i = 0; i < result.length; i++) {
            if(i < _xInBytes.length) {
                result[i] = _xInBytes[i];
            } else {
                result[i] = _yInBytes[i-_xInBytes.length];
            }
        }

        return string(result);
    }

    function compare(string memory _x, string memory _y) public pure returns(bool) {
        return keccak256(abi.encodePacked(_x)) == keccak256(abi.encodePacked(_y));
    }

    function indexOf(string memory _x, string memory _needle) public pure returns(int) {
        bytes memory _xInBytes = bytes(_x);
        bytes memory _nInBytes = bytes(_needle);

        if(_xInBytes.length < 1 || _nInBytes.length < 1 || _xInBytes.length < _nInBytes.length) {
            return -1;
        }

        uint subindex = 0;
        for(uint i = 0; i < _xInBytes.length; i++) {
            if (_xInBytes[i] == _nInBytes[subindex]) {
                subindex = 1;
                while(subindex < _nInBytes.length && (i+subindex) < _xInBytes.length && _xInBytes[i+subindex] == _nInBytes[subindex]) {
                    subindex++;
                }

                if(subindex == _nInBytes.length) {
                    return int(i);
                }
            }
        }

        return -1;
    }
}
