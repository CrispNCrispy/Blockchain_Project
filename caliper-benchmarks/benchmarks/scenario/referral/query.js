'use strict';

module.exports.info  = 'querying all patient details';


let bc, contx;
let ID_array;
let patientFirstName;

module.exports.init = function(blockchain, context, args) {
    const register = require('./register.js');
    bc       = blockchain;
    contx    = context;
    ID_array = register.ID_array;
    patientFirstName = args.patientFirstName;

    return Promise.resolve();
};

module.exports.run = function() {
    const ID  = ID_array[Math.floor(Math.random()*(ID_array.length))];

    if (bc.getType() === 'fabric') {
        let args = {
            chaincodeFunction: 'getDetails',
            chaincodeArguments: [patientFirstName,ID],
        };

        return bc.bcObj.querySmartContract(contx, 'referral', '0.0.3', args);
    }
};

module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};
