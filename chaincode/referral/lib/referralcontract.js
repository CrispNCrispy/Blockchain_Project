/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// Referralnet specifc classes
const Patient = require('./patient.js');
const PatientList = require('./patientlist.js');

/**
 * A custom context provides easy access to list of all patients
 */
class ReferralContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.patientList = new PatientList(this);
    }

}

/**
 * Define referral smart contract by extending Fabric Contract class
 *
 */
class ReferralContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.referralnet.referral');
    }

    /**
     * Define a custom context for patient
    */
    createContext() {
        return new ReferralContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        console.log('Instantiated the contract');
    }

    /**
     * Register User
     *
     * @param {Context} ctx the transaction context
     * @param {String} patientFirstName first name of patient
     * @param {Number} patientID patient unique ID number for this issuer
     * @param {String} patientLastName last name of patient
     * @param {String} patientDOB DOB of patient
     * @param {String} patientEmail Email of patient
     * @param {Number} patientNumber1 face value of paper
     * @param {Number} patientNumber2 face value of paper
     * @param {String} patientAddress Email of patient
     * @param {String} patientBloodGroup Blood Group of patient
    */
    async registerPatient(ctx, patientFirstName, patientID, patientLastName, patientDOB, patientEmail,patientNumber1, patientNumber2, patientAddress, patientBloodGroup) {
        // create an instance of the paper
        let patient = Patient.createInstance(ctx, patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup) ;

        // Smart contract, rather than paper, moves paper into ISSUED state
        patient.setRegistered();

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.patientList.addPatient(patient);

        // Must return a serialized paper to caller of smart contract
        return patient;
    }


}

module.exports = ReferralContract;
