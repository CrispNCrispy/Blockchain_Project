/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

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
        if (process.argv.length != 8 || process.argv.length != 9) {
            console.log('Require 8 (or 9) arguments: patient first name, patient ID, patient last name, patient DOB, patient email, patient number 1, patient number 2 (optional), patient address and patient blood group');
            return;
        }

INCLUDE THIS WHEN WE GET INPUTS FROM FRONT-END
*/

        //const patientFirstName = process.argv[2];
        //const patientID = process.argv[3];
        //const patientLastName = process.argv[4];
	//const patientDOB = process.argv[5];
	//const patientEmail = process.argv[6];
	//const patientNumber1 = process.argv[7];
	//const patientNumber2 = process.argv[8];
	//const patientAddress = process.argv[9];
	//const patientBloodGroup = process.argv[10];
	//ADD THE CONDITION IF PATIENT NUMBER 2 IS EMPTY, ASSIGN AS UNDEFINED

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channel13');

        // Get the contract from the network.
        const contract = network.getContract('referralcontract');

        await contract.submitTransaction('registerPatient', 'Chris', 12345, 'Pinto', '06-12-1997', 'cpinto4u@gmail.com', 9986981226, 8762626326, 'Kadri, Mangalore', 'A+' );
        
	console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
