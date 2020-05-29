/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const Patient = require('../../../../chaincode/referral/lib/patient.js')

function toDate(timestamp) {
  const milliseconds = (timestamp.seconds.low + ((timestamp.nanos / 1000000) / 1000)) * 1000;
  return new Date(milliseconds);
}

async function main() {
    try {

	if (process.argv.length != 4) {
            console.log('Requires 2 arguments: patient first name and patient ID');
            return;
        }

        const patientFirstName = process.argv[2];
        const patientID = process.argv[3];

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

        const response = await contract.submitTransaction('getDetails', patientFirstName, patientID);
     
	console.log('Query has been submitted');

	let patient = Patient.fromBuffer(response);

        console.log('Patient First Name:',patient.patientFirstName);
	console.log('Patient ID:', parseInt(patient.patientID));
	console.log('Patient Last Name:', patient.patientLastName);
	console.log('Patient DOB:', patient.patientDOB);
	console.log('Patient Email:', patient.patientEmail);
	console.log('Patient Contact Number:', patient.patientNumber1);
	console.log('Patient Alternative Contact Number:', patient.patientNumber2);
	console.log('Patient Address:', patient.patientAddress);
	console.log('Patient Blood Group:', patient.patientBloodGroup);
	console.log('Patient Current State:', patient.currentState);
	console.log('\n');
	console.log('Patient Request Details: ', JSON.parse(patient.requestDetails));
	console.log('\n');
	console.log('Patient PHC Treatment Details: ', JSON.parse(patient.treatmentPHC));
	console.log('\n');
	console.log('Patient Referral Details: ', JSON.parse(patient.referralDetails));
	console.log('\n');
	console.log('Patient Government Hospital Details: ', JSON.parse(patient.treatmentGovtHos));
	

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
