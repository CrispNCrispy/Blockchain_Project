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

	if (process.argv.length != 9) {
            console.log('Requires 7 argument: Patient First Name, Patient ID, Government Hospital Name, Referred To Contact, Referred To Email, Referred To UserID, Referred To LocalID');
            return;
        }

        const patientFirstName = process.argv[2];
        const patientID = process.argv[3];
	const _GovtHos = process.argv[4];
	const _referredToContact = process.argv[5];
	const _referredToEmail = process.argv[6];
	const _referredToUserID = process.argv[7];
	const _referredToLocalID = process.argv[8];

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

        const response = await contract.submitTransaction('acceptReferral', patientFirstName, patientID, _GovtHos, _referredToContact, _referredToEmail, _referredToUserID, _referredToLocalID);
     
	console.log('Transaction has been submitted');

	let patient = Patient.fromBuffer(response);

	const GovtHos = JSON.parse(patient.referralAcceptanceDetails).GovtHos;
	const referredToContact = JSON.parse(patient.referralAcceptanceDetails).referredToContact;
	const referredToEmail = JSON.parse(patient.referralAcceptanceDetails).referredToEmail;
	const referredToUserID = JSON.parse(patient.referralAcceptanceDetails).referredToUserID;
	const referredToLocalID = JSON.parse(patient.referralAcceptanceDetails).referredToLocalID;
	const referralAcceptanceTimestamp = toDate(JSON.parse(patient.referralAcceptanceDetails).referralAcceptanceTimestamp);
	const referralAcceptanceTxID = JSON.parse(patient.referralAcceptanceDetails).referralAcceptanceTxID;

	console.log('Referral Acceptance successful for patient ' + patient.patientFirstName + ' with Patient ID ' + patient.patientID + '. Details:');
	console.log('Government Hospital: ' + GovtHos);
	console.log('Referred To Contact: ' + referredToContact);
	console.log('Referred To Email: ' + referredToEmail);
	console.log('Referred To UserID: ' + referredToUserID);
	console.log('Referral To LocalID: ' + referredToLocalID);
	console.log('Referral Date and Time: ' + referralAcceptanceTimestamp);
	console.log('Referral Transaction ID: ' + referralAcceptanceTxID);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
