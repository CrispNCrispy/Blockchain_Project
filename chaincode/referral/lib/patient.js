/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate patient state values
const pState = {
    REGISTERED: "Registered",
    REQUESTED: "Requested for PHC visit",
    TREATED: "PHC check-up completed",
    REFERRED: "Referred to Hospital",
    REFERRED_AND_TREATED: "Hospital treatment/check-up completed"
};

/**
 * Patient class extends State class
 * Class will be used by application and smart contract to register patient details
 */
class Patient extends State {

    constructor(obj) {
        super(Patient.getClass(), [obj.patientFirstName, obj.patientID]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getPatientFirstName() {
        return this.patientFirstName;
    }

    getPatientLastName() {
        return this.patientLastName;
    }
    //ADD MORE SETTERS AND GETTERS!!

    /**
     * Useful methods to encapsulate patient states
     */
    setRegistered() {
        this.currentState = pState.REGISTERED;
    }

    setRequested() {
        this.currentState = pState.REQUESTED;
    }

    setTreated() {
        this.currentState = pState.TREATED;
    }

    setReferred() {
        this.currentState = pState.REFERRED;
    }

    setReferredAndTreated() {
        this.currentState = pState.REFERRED_AND_TREATED;
    }

    isRegistered() {
        return this.currentState === pState.REGISTERED;
    }

    isRequested() {
        return this.currentState === pState.REQUESTED;
    }

    isTreated() {
        return this.currentState === pState.TREATED;
    }

    isReferred() {
        return this.currentState === pState.REFERRED;
    }

    isReferredAndTreated() {
        return this.currentState === pState.REFERRED_AND_TREATED;
    }

    createRequest(requestReason, requestTimestamp) {
        this.requestDetails = JSON.parse(this.requestDetails)
        this.requestDetails.requestReason = requestReason;
        this.requestDetails.requestTimestamp = requestTimestamp;
        this.requestDetails = JSON.stringify(this.requestDetails)
    }

    treatAtPHC(treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary, treatmentTimestamp, treatmentTxID) {
        this.treatmentPHC = JSON.parse(this.treatmentPHC)
        this.treatmentPHC.treatingOrganization = treatingOrganization;
        this.treatmentPHC.treatedByContact = treatedByContact;
        this.treatmentPHC.treatedByEmail = treatedByEmail;
        this.treatmentPHC.treatedByUserID = treatedByUserID;
        this.treatmentPHC.treatedByLocalID = treatedByLocalID;
        this.treatmentPHC.treatmentSummary = treatmentSummary;
        this.treatmentPHC.treatmentTimestamp = treatmentTimestamp;
        this.treatmentPHC.treatmentTxID = treatmentTxID;
        this.treatmentPHC = JSON.stringify(this.treatmentPHC);
    }

    referToGovtHos(referralID, referringOrganization, referredByContact, referredByEmail, referredByUserID, referredByLocalID, referredToContact, referredToEmail, referredToUserID, referredToLocalID, referralReason, referralNote, referralPriorityFlag, referralTimestamp, referralTxID) {
        this.referralDetails = JSON.parse(this.referralDetails);
        this.referralDetails.referralID = referralID;
        this.referralDetails.referringOrganization = referringOrganization;
        this.referralDetails.referredByContact = referredByContact;
        this.referralDetails.referredByEmail = referredByEmail;
        this.referralDetails.referredByUserID = referredByUserID;
        this.referralDetails.referredByLocalID = referredByLocalID;
        this.referralDetails.referredToContact = referredToContact;
        this.referralDetails.referredToEmail = referredToEmail;
        this.referralDetails.referredToUserID = referredToUserID;
        this.referralDetails.referredToLocalID = referredToLocalID;
        this.referralDetails.referralReason = referralReason;
        this.referralDetails.referralNote = referralNote;
        this.referralDetails.referralPriorityFlag = referralPriorityFlag;
        this.referralDetails.referralTimestamp = referralTimestamp;
        this.referralDetails.referralTxID = referralTxID;
        this.referralDetails = JSON.stringify(this.referralDetails);
    }

    treatAtGovtHos(treatingOrganization, treatedByContact, treatedByEmail, treatedByUserID, treatedByLocalID, treatmentSummary, treatmentTimestamp, treatmentTxID) {
        this.treatmentGovtHos = JSON.parse(this.treatmentGovtHos)
        this.treatmentGovtHos.treatingOrganization = treatingOrganization;
        this.treatmentGovtHos.treatedByContact = treatedByContact;
        this.treatmentGovtHos.treatedByEmail = treatedByEmail;
        this.treatmentGovtHos.treatedByUserID = treatedByUserID;
        this.treatmentGovtHos.treatedByLocalID = treatedByLocalID;
        this.treatmentGovtHos.treatmentSummary = treatmentSummary;
        this.treatmentGovtHos.treatmentTimestamp = treatmentTimestamp;
        this.treatmentGovtHos.treatmentTxID = treatmentTxID;
        this.treatmentGovtHos = JSON.stringify(this.treatmentGovtHos);
    }

    static fromBuffer(buffer) {
        return Patient.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to patient details
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Patient);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup, requestDetails, treatmentPHC, treatmentGovtHos, referralDetails) {
        return new Patient({patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup, requestDetails, treatmentPHC, treatmentGovtHos, referralDetails});
    }

    static getClass() {
        return 'org.referralnet.patient';
    }
}

module.exports = Patient;
