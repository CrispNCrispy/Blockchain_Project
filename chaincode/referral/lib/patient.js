/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Create patient state values as an object
const pState = {
    REGISTERED: "Registered",
    REQUESTED: "Requested for PHC Visit",
    TREATED: "PHC Check-up Completed",
    REFERRED: "Referred to Hospital, Waiting for Acceptance",
    REFERRED_ACCEPTED: "Referral Accepted by Hospital",
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

    //Space to add Getters and Setters if needed

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
    setReferredAccepted() {
        this.currentState = pState.REFERRED_ACCEPTED;
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
    isReferredAccepted() {
        return this.currentState === pState.REFERRED_ACCEPTED;
    }
    isReferredAndTreated() {
        return this.currentState === pState.REFERRED_AND_TREATED;
    }

    /**
     * Methods involving updation of request, treatment or referral details
     */
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

    referToGovtHos(referralID, PHC, referredByContact, referredByEmail, referredByUserID, referredByLocalID, referralLocalPatientID, referralLocalNodeID, referralReason, referralNote, referralPriorityFlag, referralIssueTimestamp, referralIssueTxID) {
        this.referralIssueDetails = JSON.parse(this.referralIssueDetails);
        this.referralIssueDetails.referralID = referralID;
        this.referralIssueDetails.PHC = PHC;
        this.referralIssueDetails.referredByContact = referredByContact;
        this.referralIssueDetails.referredByEmail = referredByEmail;
        this.referralIssueDetails.referredByUserID = referredByUserID;
        this.referralIssueDetails.referredByLocalID = referredByLocalID;
        this.referralIssueDetails.referralLocalPatientID = referralLocalPatientID
        this.referralIssueDetails.referralLocalNodeID = referralLocalNodeID;
        this.referralIssueDetails.referralReason = referralReason;
        this.referralIssueDetails.referralNote = referralNote;
        this.referralIssueDetails.referralPriorityFlag = referralPriorityFlag;
        this.referralIssueDetails.referralIssueTimestamp = referralIssueTimestamp;
        this.referralIssueDetails.referralIssueTxID = referralIssueTxID;
        this.referralIssueDetails = JSON.stringify(this.referralIssueDetails);
    }

    acceptReferral(GovtHos, referredToContact, referredToEmail, referredToUserID, referredToLocalID, referralAcceptanceTimestamp, referralAcceptanceTxID) {
        this.referralAcceptanceDetails = JSON.parse(this.referralAcceptanceDetails);
        this.referralAcceptanceDetails.GovtHos = GovtHos;
        this.referralAcceptanceDetails.referredToContact = referredToContact;
        this.referralAcceptanceDetails.referredToEmail = referredToEmail;
        this.referralAcceptanceDetails.referredToUserID = referredToUserID;
        this.referralAcceptanceDetails.referredToLocalID = referredToLocalID;
        this.referralAcceptanceDetails.referralAcceptanceTimestamp = referralAcceptanceTimestamp;
        this.referralAcceptanceDetails.referralAcceptanceTxID = referralAcceptanceTxID;
        this.referralAcceptanceDetails = JSON.stringify(this.referralAcceptanceDetails);
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

    /**
     * Serialize/De-serialize methods
     */
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
    static createInstance(patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup, requestDetails, treatmentPHC, treatmentGovtHos, referralIssueDetails, referralAcceptanceDetails) {
        return new Patient({patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup, requestDetails, treatmentPHC, treatmentGovtHos, referralIssueDetails, referralAcceptanceDetails});
    }

    static getClass() {
        return 'org.referralnet.patient';
    }
}

module.exports = Patient;
