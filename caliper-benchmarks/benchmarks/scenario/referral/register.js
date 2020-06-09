'use strict';

module.exports.info  = 'registering patients';

let ID_array = [];
let txnPerBatch;
let patientFirstName;
let patientLastName;
let patientDOB;
let patientEmail;
let patientNumber1;
let patientNumber2;
let patientAddress;
let patientBloodGroup;

let bc, contx;

module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('txnPerBatch')) {
        args.txnPerBatch = 1;
    }
    patientFirstName = args.patientFirstName;
    patientLastName = args.patientLastName;
    patientDOB = args.patientDOB;
    patientEmail = args.patientEmail;
    patientNumber1 = args.patientNumber1;
    patientNumber2 = args.patientNumber2;
    patientAddress = args.patientAddress;
    patientBloodGroup = args.patientBloodGroup;
    txnPerBatch = args.txnPerBatch;
    bc = blockchain;
    contx = context;

    return Promise.resolve();
};

const dic = 'abcdefghijklmnopqrstuvwxyz';
/**
 * Generate string by picking characters from dic variable
 * @param {*} number character to select
 * @returns {String} string generated based on @param number
 */
function get26Num(number){
    let result = '';
    while(number > 0) {
        result += dic.charAt(number % 26);
        number = parseInt(number/26);
    }
    return result;
}

let prefix;
/**
 * Generate unique patient ID for the transaction
 * @returns {String} account key
 */
function generateID() {
    // should be [a-z]{1,9}
    if(typeof prefix === 'undefined') {
        prefix = get26Num(process.pid);
    }
    return prefix + get26Num(ID_array.length+1);
}

/**
 * Generates simple workload
 * @returns {Object} array of json objects
 */
function generateWorkload() {
    let workload = [];
    for(let i= 0; i < txnPerBatch; i++) {
        let patient_id = generateID();
        ID_array.push(patient_id);

        if (bc.getType() === 'fabric') {
            workload.push({
                chaincodeFunction: 'registerPatient',
                chaincodeArguments: [patientFirstName, patient_id, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup],
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
    return Promise.resolve();
};

module.exports.ID_array = ID_array;
