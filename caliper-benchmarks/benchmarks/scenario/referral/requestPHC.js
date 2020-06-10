'use strict';

module.exports.info  = 'requesting for PHC check-ups';

let bc, contx;
let ID_array;
let patientFirstName;
let requestReason;

module.exports.init = function(blockchain, context, args) {
    const register = require('./register.js');
    bc       = blockchain;
    contx    = context;
    ID_array = register.ID_array;
    patientFirstName = args.patientFirstName;
    requestReason = args.requestReason;

    return Promise.resolve();
};

function generateWorkload() {
    let workload = [];
    for(let i= 0; i < ID_array.length; i++) {
        let id = ID_array[i];

        if (bc.getType() === 'fabric') {
            workload.push({
                chaincodeFunction: 'requestPHC',
                chaincodeArguments: [patientFirstName, id, requestReason],
            });
        } 
    }
    return workload;
}

module.exports.run = function() {
    let args = generateWorkload();
    return bc.invokeSmartContract(contx, 'referral', '0.0.3', args);
};

module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};
