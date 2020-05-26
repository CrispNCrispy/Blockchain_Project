/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const Patient = require('../../../../chaincode/referral/lib/patient.js')

async function main() {
    try {
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

	/*
        if (process.argv.length != 2) {
            console.log('Require 8 (or 9) arguments: patient first name, patient ID, patient last name, patient DOB, patient email, patient number 1, patient number 2 (optional), patient address and patient blood group');
            return;
        }

        //const patientFirstName = process.argv[2];
        //const patientID = process.argv[3]

INCLUDE THIS WHEN WE GET INPUTS FROM FRONT-END

*/

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

        const response = await contract.submitTransaction('getPersonalDetails', 'Chris', 12345);
     
	console.log('Query has been submitted');

	let patient = Patient.fromBuffer(response);

	patient.patientDOB=patient.patientDOB.toISOString().substring(0, 10)

        console.log('Patient First Name:',patient.patientFirstName);
	console.log('Patient ID:', patient.patientID);
	console.log('Patient Last Name:', patient.patientLastName);
	console.log('Patient DOB:', patient.patientDOB);
	console.log('Patient Email:', patient.patientEmail);
	console.log('Patient Contact Number:', patient.patientNumber1);
	console.log('Patient Alternative Contact Number:', patient.patientNumber2);
	console.log('Patient Address:', patient.patientAddress);
	console.log('Patient Blood Group:', patient.patientBloodGroup);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
