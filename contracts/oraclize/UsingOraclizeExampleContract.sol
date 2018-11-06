pragma solidity ^0.4.24;

import "./oraclizeAPI.sol";


contract UsingOraclizeExampleContract is usingOraclize {

    string public ETHUSD;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

    constructor(address _oar) public {
        OAR = OraclizeAddrResolverI(_oar);
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) revert();
        ETHUSD = result;
        LogPriceUpdated(result);
    }

    function updatePrice() public payable {
        if (oraclize_getPrice("URL") > this.balance) {
            LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price");
        }
    }
}
