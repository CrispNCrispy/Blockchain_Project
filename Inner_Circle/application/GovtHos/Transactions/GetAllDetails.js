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
		
	console.log('=================================');
	console.log('Patint Personal Details:');
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

	console.log('=================================');
	const reason1 = JSON.parse(patient.requestDetails).requestReason;
	let time1;
	if(typeof JSON.parse(patient.requestDetails).requestTimestamp == 'object') {
		time1 = toDate(JSON.parse(patient.requestDetails).requestTimestamp);
	}
	else {
		time1 = JSON.parse(patient.requestDetails).requestTimestamp;
	}
	console.log('Latest Patient Request Details: ');
	console.log('Request Reason: ' + reason1) 
	console.log('Date and Time of request: ' + time1)

	console.log('=================================');
	const treatingOrganization2 = JSON.parse(patient.treatmentPHC).treatingOrganization;
	const treatedByContact2 = JSON.parse(patient.treatmentPHC).treatedByContact;
	const treatedByEmail2 = JSON.parse(patient.treatmentPHC).treatedByEmail;
	const treatedByUserID2 = JSON.parse(patient.treatmentPHC).treatedByUserID;
	const treatedByLocalID2 = JSON.parse(patient.treatmentPHC).treatedByLocalID;
	const treatmentSummary2 = JSON.parse(patient.treatmentPHC).treatmentSummary;
	const treatmentTxID2 = JSON.parse(patient.treatmentPHC).treatmentTxID;
	let time2;
       	if(typeof JSON.parse(patient.treatmentPHC).treatmentTimestamp == 'object') {
		time2 = toDate(JSON.parse(patient.treatmentPHC).treatmentTimestamp);
	}
	else {
		time2 = JSON.parse(patient.treatmentPHC).treatmentTimestamp;
	}
	console.log('Latest Patient PHC Treatment Details: ');	
	console.log('Treating Organization: ' + treatingOrganization2);
	console.log('Treated By Contact: ' + treatedByContact2);
	console.log('Treated By Email: ' + treatedByEmail2);
	console.log('Treated By User ID: ' + treatedByUserID2);
	console.log('Treated By Local ID: ' + treatedByLocalID2);
	console.log('Treatment Summary: ' + treatmentSummary2)
	console.log('Treatment Date and Time: ' + time2)
	console.log('Treatment Transaction ID: ' + treatmentTxID2)

	console.log('=================================');
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
	let time3;
	if(typeof JSON.parse(patient.referralDetails).referralTimestamp == 'object') {
		time3 = toDate(JSON.parse(patient.referralDetails).referralTimestamp);
	}
	else {
		time3 = JSON.parse(patient.referralDetails).referralTimestamp;
	}
	const referralTxID3 = JSON.parse(patient.referralDetails).referralTxID;
	console.log('Latest Patient Referral Details:');
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
	console.log('Referral Date and Time: ' + time3);
	console.log('Referral Transaction ID: ' + referralTxID3);

	console.log('=================================');
	const treatingOrganization4 = JSON.parse(patient.treatmentGovtHos).treatingOrganization;
	const treatedByContact4 = JSON.parse(patient.treatmentGovtHos).treatedByContact;
	const treatedByEmail4 = JSON.parse(patient.treatmentGovtHos).treatedByEmail;
	const treatedByUserID4 = JSON.parse(patient.treatmentGovtHos).treatedByUserID;
	const treatedByLocalID4 = JSON.parse(patient.treatmentGovtHos).treatedByLocalID;
	const treatmentSummary4 = JSON.parse(patient.treatmentGovtHos).treatmentSummary;
	const treatmentTxID4 = JSON.parse(patient.treatmentGovtHos).treatmentTxID;
	let time4;
	if(typeof JSON.parse(patient.treatmentGovtHos).treatmentTimestamp == 'object') {
		time4 = toDate(JSON.parse(patient.treatmentGovtHos).treatmentTimestamp);
	}
	else {
		time4 = JSON.parse(patient.treatmentGovtHos).treatmentTimestamp;
	}
	console.log('Latest Patient Government Hospital Treatment Details: ');
	console.log('Treating Organization: ' + treatingOrganization4);
	console.log('Treated By Contact: ' + treatedByContact4);
	console.log('Treated By Email: ' + treatedByEmail4);
	console.log('Treated By User ID: ' + treatedByUserID4);
	console.log('Treated By Local ID: ' + treatedByLocalID4);
	console.log('Treatment Summary: ' + treatmentSummary4)
	console.log('Treatment Date and Time: ' + time4)	
	console.log('Treatment Transaction ID: ' + treatmentTxID4)
	

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
