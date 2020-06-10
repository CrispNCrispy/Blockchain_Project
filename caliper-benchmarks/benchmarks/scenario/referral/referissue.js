'use strict';

module.exports.info  = 'PHC issuing referrals';

let bc, contx;
let ID_array;
let patientFirstName;
let referralID;
let PHC;
let referredByContact;
let referredByEmail;
let referredByUserID;
let referredByLocalID;
let referralLocalPatientID;
let referralLocalNodeID;
let referralReason;
let referralNote;
let referralPriorityFlag;

module.exports.init = function(blockchain, context, args) {
    const register = require('./register.js');
    bc       = blockchain;
    contx    = context;
    ID_array = register.ID_array;
    patientFirstName = args.patientFirstName;
    referralID = args.referralID;
    PHC = args.PHC;
    referredByContact = args.referredByContact;
    referredByEmail = args.referredByEmail;
    referredByUserID = args.referredByUserID;
    referredByLocalID = args.referredByLocalID;
    referralLocalPatientID = args.referralLocalPatientID;
    referralLocalNodeID = args.referralLocalNodeID;
    referralReason = args.referralReason;
    referralNote = args.referralNote;
    referralPriorityFlag = args.referralPriorityFlag;

    return Promise.resolve();
};

function generateWorkload() {
    let workload = [];
    for(let i= 0; i < ID_array.length; i++) {
        let id = ID_array[i];

        if (bc.getType() === 'fabric') {
            workload.push({
                chaincodeFunction: 'referToGovtHos',
                chaincodeArguments: [patientFirstName, id, referralID.toString(), PHC, referredByContact.toString(), referredByEmail, referredByUserID.toString(), referredByLocalID.toString(), referralLocalPatientID.toString(), referralLocalNodeID.toString(), referralReason, referralNote, referralPriorityFlag],
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
