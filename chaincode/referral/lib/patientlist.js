/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states - a state list
const StateList = require('./../ledger-api/statelist.js');

const Patient = require('./patient.js');

class PatientList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.referralnet.referrallist');
        this.use(Patient);
    }

    async addPatient(patient) {
        return this.addState(patient);
    }

    async getPatient(patientKey) {
        return this.getState(patientKey);
    }

    async updatePatient(patient) {
        return this.updateState(patient);
    }
}


module.exports = PatientList;