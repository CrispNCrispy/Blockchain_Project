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
    static createInstance(patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup) {
        return new Patient({patientFirstName, patientID, patientLastName, patientDOB, patientEmail, patientNumber1, patientNumber2, patientAddress, patientBloodGroup});
    }

    static getClass() {
        return 'org.referralnet.patient';
    }
}

module.exports = Patient;
