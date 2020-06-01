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
     * Register Patient
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
    async registerPatient(ctx, patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup) {
        const requestDetails = JSON.stringify({requestReason: 'N/A', requestTimestamp: 'N/A'});
        const treatmentPHC = JSON.stringify({treatingOrganization: 'N/A', treatedByContact: 'N/A', treatedByEmail: 'N/A', treatedByUserID: 'N/A', treatedByLocalID: 'N/A', treatmentSummary: 'N/A', treatmentTimestamp: 'N/A', treatmentTxID: 'N/A'});
        const treatmentGovtHos = JSON.stringify({treatingOrganization: 'N/A', treatedByContact: 'N/A', treatedByEmail: 'N/A', treatedByUserID: 'N/A', treatedByLocalID: 'N/A', treatmentSummary: 'N/A', treatmentTimestamp: 'N/A',  treatmentTxID: 'N/A'});
        const referralIssueDetails = JSON.stringify({referralID: 'N/A', PHC: 'N/A', referredByContact: 'N/A', referredByEmail: 'N/A', referredByUserID: 'N/A', referredByLocalID: 'N/A', referralLocalPatientID: 'N/A', referralLocalNodeID: 'N/A', referralReason: 'N/A', referralNote: 'N/A', referralPriorityFlag: 'N/A', referralIssueTimestamp: 'N/A', referralIssueTxID: 'N/A'})
        const referralAcceptanceDetails = JSON.stringify({GovtHos: 'N/A', referredToContact: 'N/A', referredToEmail: 'N/A', referredToUserID: 'N/A', referredToLocalID: 'N/A', referralAcceptanceTimestamp: 'N/A', referralAcceptanceTxID: 'N/A'})

        // create an instance of the paper
        let patient = Patient.createInstance(patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup, requestDetails, treatmentPHC, treatmentGovtHos, referralIssueDetails, referralAcceptanceDetails);

        // Smart contract, rather than paper, moves paper into ISSUED state
        patient.setRegistered();

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.patientList.addPatient(patient);

        // return serialized patient details to caller of smart contract
        return patient.toBuffer();
    }

    async requestPHC(ctx, patientFirstName, patientID, requestReason) {

        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        if (patient.isRequested()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already requested for a check-up');
        }

        if (patient.isReferred()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been issued a referral by a PHC');
        }

        if (patient.isReferredAccepted()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been successfully referred to a hospital');
        }

        if (patient.isRegistered() || patient.isTreated() || patient.isReferredAndTreated()) {
            patient.setRequested();
            patient.createRequest(requestReason, ctx.stub.getTxTimestamp());
        }

        await ctx.patientList.updatePatient(patient)
        return patient.toBuffer()
    }

    async PHCTreatment(ctx, patientFirstName, patientID, treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary) {
        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        if (patient.isRegistered()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' needs to request for PHC check-up first');
        }

        if (patient.isTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as treated');
        }

        if (patient.isReferredAndTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as referred and treated. Please create a new PHC check-up request');
        }

        if (patient.isReferred()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has been marked as referral issued');
        }

        if (patient.isReferredAccepted()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has been marked as referral accepted');
        }

        if (patient.isRequested()) {
            patient.setTreated();
            patient.treatAtPHC(treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary, ctx.stub.getTxTimestamp(), ctx.stub.getTxID());
        }

        await ctx.patientList.updatePatient(patient)
        return patient.toBuffer()
    }

    async referToGovtHos(ctx, patientFirstName, patientID, referralID, PHC, referredByContact, referredByEmail, referredByUserID, referredByLocalID, referralLocalPatientID, referralLocalNodeID, referralReason, referralNote, referralPriorityFlag) {
        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        if (patient.isRegistered()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' needs to request for PHC check-up first');
        }

        if (patient.isTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as treated by PHC.');
        }

        if (patient.isReferredAndTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as referred and treated. Request for PHC check-up first.');
        }

        if (patient.isReferred()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been issued by the PHC a referral');
        }

        if (patient.isReferredAccepted()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been accepted by a hospital for the referral');
        }

        if (patient.isRequested()) {
            patient.setReferred();
            patient.referToGovtHos(referralID, PHC, referredByContact, referredByEmail, referredByUserID, referredByLocalID, referralLocalPatientID, referralLocalNodeID, referralReason, referralNote, referralPriorityFlag, ctx.stub.getTxTimestamp(), ctx.stub.getTxID());
        }

        await ctx.patientList.updatePatient(patient)
        return patient.toBuffer()
    }

    async acceptReferral(ctx, patientFirstName, patientID, GovtHos, referredToContact, referredToEmail, referredToUserID, referredToLocalID) {
        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        if (patient.isRegistered()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' needs to request for PHC check-up first');
        }

        if (patient.isTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as treated by PHC.');
        }

        if (patient.isReferredAndTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as referred and treated. Request for PHC check-up first.');
        }

        if (patient.isRequested()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' is marked as "requested for a check-up", a referral needs to be issued first before accepting');
        }

        if (patient.isReferredAccepted()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been accepted by a hospital');
        }

        if (patient.isReferred()) {
            patient.setReferredAccepted();
            patient.acceptReferral(GovtHos, referredToContact, referredToEmail, referredToUserID, referredToLocalID, ctx.stub.getTxTimestamp(), ctx.stub.getTxID());
        }

        await ctx.patientList.updatePatient(patient)
        return patient.toBuffer()
    }

    async GovtHosTreatment(ctx, patientFirstName, patientID, treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary) {
        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        if (patient.isRegistered()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' needs to request for PHC check-up first');
        }

        if (patient.isTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as treated by PHC.');
        }

        if (patient.isReferredAndTreated()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has already been marked as referred and treated.');
        }

        if (patient.isRequested()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' has currently requested for a check-up at the PHC');
        }

        if (patient.isReferred()) {
            throw new Error('Patient ' + patientFirstName + ' with ID ' + patientID + ' needs to be accepted by the hospital before being marked as treated');
        }

        if (patient.isReferredAccepted()) {
            patient.setReferredAndTreated();
            patient.treatAtGovtHos(treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary, ctx.stub.getTxTimestamp(), ctx.stub.getTxID());
        }

        await ctx.patientList.updatePatient(patient)
        return patient.toBuffer()
    }

    async getDetails(ctx,patientFirstName, patientID) {
        // make keys from the two required parameters, patientFirstName and patientID
        let patientKey = Patient.makeKey([patientFirstName, patientID]);

        // use the stub method to get the patient details from the blockchain
        let patient = await ctx.patientList.getPatient(patientKey);

        //return serialized patient details
        return patient.toBuffer();
    }

}

module.exports = ReferralContract;
