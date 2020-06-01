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

	if (process.argv.length != 15) {
            console.log('Requires 13 argument: Patient First Name, Patient ID, ReferralID, PHC Name, Referred By Contact, Referred By Email, Referred By UserID, Referred By LocalID, Local Patient ID, Local Node ID, Referral Reason, Referral Note, Referral Priority Flag');
            return;
        }

        const patientFirstName = process.argv[2];
        const patientID = process.argv[3];
	const _referralID = process.argv[4];
	const _PHC = process.argv[5];
	const _referredByContact = process.argv[6];
	const _referredByEmail = process.argv[7];
	const _referredByUserID = process.argv[8];
	const _referredByLocalID = process.argv[9];
	const _referralLocalPatientID = process.argv[10];
	const _referralLocalNodeID = process.argv[11];
	const _referralReason = process.argv[12];
	const _referralNote = process.argv[13];
	const _referralPriorityFlag = process.argv[14];

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

        const response = await contract.submitTransaction('referToGovtHos', patientFirstName, patientID, _referralID, _PHC, _referredByContact, _referredByEmail, _referredByUserID, _referredByLocalID, _referralLocalPatientID, _referralLocalNodeID, _referralReason, _referralNote, _referralPriorityFlag);
     
	console.log('Transaction has been submitted');

	let patient = Patient.fromBuffer(response);

        const referralID = JSON.parse(patient.referralIssueDetails).referralID;
	const PHC = JSON.parse(patient.referralIssueDetails).PHC;
	const referredByContact = JSON.parse(patient.referralIssueDetails).referredByContact;
	const referredByEmail = JSON.parse(patient.referralIssueDetails).referredByEmail;
	const referredByUserID = JSON.parse(patient.referralIssueDetails).referredByUserID;
	const referredByLocalID = JSON.parse(patient.referralIssueDetails).referredByLocalID;
	const referralLocalPatientID = JSON.parse(patient.referralIssueDetails).referralLocalPatientID;
	const referralLocalNodeID = JSON.parse(patient.referralIssueDetails).referralLocalNodeID;
	const referralReason = JSON.parse(patient.referralIssueDetails).referralReason;
	const referralNote = JSON.parse(patient.referralIssueDetails).referralNote;
	const referralPriorityFlag = JSON.parse(patient.referralIssueDetails).referralPriorityFlag;
	const referralIssueTimestamp = toDate(JSON.parse(patient.referralIssueDetails).referralIssueTimestamp);
	const referralIssueTxID = JSON.parse(patient.referralIssueDetails).referralIssueTxID;

	console.log('Referral Issue successful for patient ' + patient.patientFirstName + ' with Patient ID ' + patient.patientID + '. Details:');
	console.log('Referral ID: ' + referralID);
	console.log('PHC: ' + PHC);
	console.log('Referred By Contact: ' + referredByContact);
	console.log('Referred By Email: ' + referredByEmail);
	console.log('Referred By UserID: ' + referredByUserID);
	console.log('Referred By LocalID: ' + referredByLocalID);
	console.log('Referral Local Patient ID: ' + referralLocalPatientID);
	console.log('Referral Local Node ID: ' + referralLocalNodeID);
	console.log('Referral Reason: ' + referralReason);
	console.log('Referral Note: ' + referralNote);
	console.log('Referral Priority Flag: ' + referralPriorityFlag);
	console.log('Referral Date and Time: ' + referralIssueTimestamp);
	console.log('Referral Transaction ID: ' + referralIssueTxID);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
