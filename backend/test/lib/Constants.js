const { BigNumber } = require("ethers")

module.exports = Object.freeze({
    ADDRESS_0 : '0x0000000000000000000000000000000000000000',
    MCKA_NAME : 'Mock Token A',
    MCKA_SYMBOL : 'MCKA',
    MCKB_NAME : 'Mock Token B',
    MCKB_SYMBOL : 'MCKB',
    BAD_PAIR_ID : BigInt('01010101010'),
    BAD_CONFIG_ID : BigInt('01010101010'),
    BAD_TOKEN_ADRESS : '0x0101000000000000000000000000000000000000',
    
    
    //token pair constante
    TOKEN_PAIR_SEGMENT_SIZE : 2500000000,
    
    
    //TOKEN amount constants
    TOKEN_INITIAL_SUPPLY :  BigInt("1000000")*BigInt("10")**BigInt("18"),
    TOKENA_DEPOSIT_AMOUNT : BigInt("5000")*BigInt("10")**BigInt("18"),
    TOKENA_WITHDRAW_AMOUNT : BigInt("100")*BigInt("10")**BigInt("18"),
    TOKENB_DEPOSIT_AMOUNT :  BigInt("3000")*BigInt("10")**BigInt("18"),
    TOKENB_WITHDRAW_AMOUNT :  BigInt("200")*BigInt("10")**BigInt("18"),
    TOKEN_AMOUNT_ABOVE_BALANCE :  BigInt("999999999")*BigInt("10")**BigInt("18"),
    
    });