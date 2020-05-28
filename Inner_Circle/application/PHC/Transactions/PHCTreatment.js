/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const Patient = require('../../../../chaincode/referral/lib/patient.js')

//function for converting hyperledger fabric timestamp to ISO datetime
function toDate(timestamp) {
  const milliseconds = (timestamp.seconds.low + ((timestamp.nanos / 1000000) / 1000)) * 1000;
  return new Date(milliseconds);
}

async function main() {
    try {

	if (process.argv.length != 10) {
            console.log('Requires 8 arguments: Patient first name, Patient ID, Treating Organization, Treated By Contact, Treated By Email, Treated By User ID, Treated By Local ID and Treatment Summary');
            return;
        }

        const patientFirstName = process.argv[2];
        const patientID = process.argv[3];
	const _treatingOrganization = process.argv[4];
	const _treatedByContact = process.argv[5];
	const _treatedByEmail = process.argv[6];
	const _treatedByUserID = process.argv[7];
	const _treatedByLocalID = process.argv[8];
	const _treatmentSummary = process.argv[9];	

        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'referral-network', 'connection-patient.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        
	console.log('Creating Gateway...');

	const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

	console.log('Gateway Connected!');

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channel13');

	console.log('Network received!');

        // Get the contract from the network.
        const contract = network.getContract('referralcontract');

	console.log('Contract Received!');

        const response = await contract.submitTransaction('PHCTreatment', patientFirstName, patientID, _treatingOrganization, _treatedByContact, _treatedByEmail, _treatedByUserID, _treatedByLocalID, _treatmentSummary);
     
	console.log('Transaction has been submitted');

	let patient = Patient.fromBuffer(response);

        const treatingOrganization = JSON.parse(patient.treatmentPHC).treatingOrganization;
	const treatedByContact = JSON.parse(patient.treatmentPHC).treatedByContact;
	const treatedByEmail = JSON.parse(patient.treatmentPHC).treatedByEmail;
	const treatedByUserID = JSON.parse(patient.treatmentPHC).treatedByUserID;
	const treatedByLocalID = JSON.parse(patient.treatmentPHC).treatedByLocalID;
	const treatmentSummary = JSON.parse(patient.treatmentPHC).treatmentSummary;
	const treatmentTxID = JSON.parse(patient.treatmentPHC).treatmentTxID;
        const time = toDate(JSON.parse(patient.treatmentPHC).treatmentTimestamp);

	console.log('Treatment entry successful for patient ' + patient.patientFirstName + ' with Patient ID ' + patient.patientID + '. Details:');
	console.log('Treating Organization: ' + treatingOrganization);
	console.log('Treated By Contact: ' + treatedByContact);
	console.log('Treated By Email: ' + treatedByEmail);
	console.log('Treated By User ID: ' + treatedByUserID);
	console.log('Treated By Local ID: ' + treatedByLocalID);
	console.log('Treatment Summary: ' + treatmentSummary)
	console.log('Treatment Date and Time: ' + time)
	console.log('Treatment Transaction ID: ' + treatmentTxID)

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
