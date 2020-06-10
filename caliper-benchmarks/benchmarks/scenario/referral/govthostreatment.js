'use strict';

module.exports.info  = 'PHC issuing referrals';

let bc, contx;
let ID_array;
let patientFirstName;
let treatingOrganization
let treatedByContact
let treatedByEmail
let treatedByUserID
let treatedByLocalID
let treatmentSummary

module.exports.init = function(blockchain, context, args) {
    const register = require('./register.js');
    bc       = blockchain;
    contx    = context;
    ID_array = register.ID_array;
    patientFirstName = args.patientFirstName;
    treatingOrganization = args.treatingOrganization;
    treatedByContact = args.treatedByContact;
    treatedByEmail = args.treatedByEmail;
    treatedByUserID = args.treatedByUserID;
    treatedByLocalID = args.treatedByLocalID;
    treatmentSummary = args.treatmentSummary;


    return Promise.resolve();
};

function generateWorkload() {
    let workload = [];
    for(let i= 0; i < ID_array.length; i++) {
        let id = ID_array[i];

        if (bc.getType() === 'fabric') {
            workload.push({
                chaincodeFunction: 'GovtHosTreatment',
                chaincodeArguments: [patientFirstName, id, treatingOrganization, treatedByContact.toString(), treatedByEmail, treatedByUserID.toString(), treatedByLocalID.toString(), treatmentSummary],
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
