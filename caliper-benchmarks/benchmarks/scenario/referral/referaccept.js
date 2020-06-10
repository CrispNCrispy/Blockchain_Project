'use strict';

module.exports.info  = 'PHC issuing referrals';

let bc, contx;
let ID_array;
let patientFirstName;
let GovtHos;
let referredToContact;
let referredToEmail;
let referredToUserID;
let referredToLocalID;

module.exports.init = function(blockchain, context, args) {
    const register = require('./register.js');
    bc       = blockchain;
    contx    = context;
    ID_array = register.ID_array;
    patientFirstName = args.patientFirstName;
    GovtHos = args.GovtHos;
    referredToContact = args.referredToContact;
    referredToEmail = args.referredToEmail;
    referredToUserID = args.referredToUserID;
    referredToLocalID = args.referredToLocalID;

    return Promise.resolve();
};

function generateWorkload() {
    let workload = [];
    for(let i= 0; i < ID_array.length; i++) {
        let id = ID_array[i];

        if (bc.getType() === 'fabric') {
            workload.push({
                chaincodeFunction: 'acceptReferral',
                chaincodeArguments: [patientFirstName, id, GovtHos, referredToContact.toString(), referredToEmail, referredToUserID.toString(), referredToLocalID.toString()],
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
