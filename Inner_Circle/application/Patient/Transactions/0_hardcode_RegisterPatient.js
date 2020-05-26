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

        const response = await contract.submitTransaction('registerPatient', 'Chris', 12345, 'Pinto', '06-12-1997', 'cpinto4u@gmail.com', 9986981226, 8762626326, 'Kadri, Mangalore', 'A+');
     
	console.log('Transaction has been submitted');

	let patient = Patient.fromBuffer(response);

        console.log(`${patient.patientFirstName} with ID ${patient.patientID} successfully created`);
        console.log('Transaction complete.');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
