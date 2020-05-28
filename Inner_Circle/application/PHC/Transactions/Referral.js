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

	if (process.argv.length != 17) {
            console.log('Requires 15 argument: Patient First Name, Patient ID, ReferralID, Referring Organization, Referred By Contact, Referred By Email, Referred By UserID, Referred By LocalID, Referred To Contact, Referred To Email, Referred To UserID, Referred To LocalID, Referral Reason, Referral Note, Referral Priority Flag');
            return;
        }

        const patientFirstName = process.argv[2];
        const patientID = process.argv[3];
	const _referralID = process.argv[4];
	const _referringOrganization = process.argv[5];
	const _referredByContact = process.argv[6];
	const _referredByEmail = process.argv[7];
	const _referredByUserID = process.argv[8];
	const _referredByLocalID = process.argv[9];
	const _referredToContact = process.argv[10];
	const _referredToEmail = process.argv[11];
	const _referredToUserID = process.argv[12];
	const _referredToLocalID = process.argv[13];
	const _referralReason = process.argv[14];
	const _referralNote = process.argv[15];
	const _referralPriorityFlag = process.argv[16];

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

        const response = await contract.submitTransaction('referToGovtHos', patientFirstName, patientID, _referralID, _referringOrganization, _referredByContact, _referredByEmail, _referredByUserID, _referredByLocalID, _referredToContact, _referredToEmail, _referredToUserID, _referredToLocalID, _referralReason, _referralNote, _referralPriorityFlag);
     
	console.log('Transaction has been submitted');

	let patient = Patient.fromBuffer(response);

        const referralID = JSON.parse(patient.referralDetails).referralID;
	const referringOrganization = JSON.parse(patient.referralDetails).referringOrganization;
	const referredByContact = JSON.parse(patient.referralDetails).referredByContact;
	const referredByEmail = JSON.parse(patient.referralDetails).referredByEmail;
	const referredByUserID = JSON.parse(patient.referralDetails).referredByUserID;
	const referredByLocalID = JSON.parse(patient.referralDetails).referredByLocalID;
	const referredToContact = JSON.parse(patient.referralDetails).referredToContact;
	const referredToEmail = JSON.parse(patient.referralDetails).referredToEmail;
	const referredToUserID = JSON.parse(patient.referralDetails).referredToUserID;
	const referredToLocalID = JSON.parse(patient.referralDetails).referredToLocalID;
	const referralReason = JSON.parse(patient.referralDetails).referralReason;
	const referralNote = JSON.parse(patient.referralDetails).referralNote;
	const referralPriorityFlag = JSON.parse(patient.referralDetails).referralPriorityFlag;
	const referralTimestamp = toDate(JSON.parse(patient.referralDetails).referralTimestamp);
	const referralTxID = JSON.parse(patient.referralDetails).referralTxID;

	console.log('Treatment entry successful for patient ' + patient.patientFirstName + ' with Patient ID ' + patient.patientID + '. Details:');
	console.log('Referral ID: ' + referralID);
	console.log('Referring Organization: ' + referringOrganization);
	console.log('Referred By Contact: ' + referredByContact);
	console.log('Referred By Email: ' + referredByEmail);
	console.log('Referred By UserID: ' + referredByUserID);
	console.log('Referred By LocalID: ' + referredByLocalID);
	console.log('Referred To Contact: ' + referredToContact);
	console.log('Referred To Email: ' + referredToEmail);
	console.log('Referred To UserID: ' + referredToUserID);
	console.log('Referral To LocalID: ' + referredToLocalID);
	console.log('Referral Reason: ' + referralReason);
	console.log('Referral Note: ' + referralNote);
	console.log('Referral Priority Flag: ' + referralPriorityFlag);
	console.log('Referral Date and Time: ' + referralTimestamp);
	console.log('Referral Transaction ID: ' + referralTxID);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
