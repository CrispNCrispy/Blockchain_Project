# Blockchain Project: E-Referral of a Patient from a PHC to a Government Hosital using Hyperledger Fabric<br>


## Status: Currently undergoing<br>
## IMPORTANT NOTE: ONLY WORKS WITH v 1.4.2 Please do not use any other version!<br>

## Network Details
### Two Networks included: Inner_Circle and Mainchannel
Main channel conists of 6 organizations: Patient, PHC, Government Hospital, Private Hospital, Research and Insurance with 2 channeles, one for the first three only ('channe13'), and one for all of them ('channelall').
Inner_Circle only uses 3 organizations: Patient, PHC and Government Hospital, with one channel, 'channel13' for all the three.

### Status of Mainchannel:
Network created with a makeshift smart contract (investment contact) to experiment with authentication systems for 6 organizations and 2 channels. Deprecated for now, using <b>Inner_Circle</b> for further project.

### Status of Inner_Cirlce: 
#### Work completed:
- Network setup and setup files complete, works only with v 1.4.2.
- Consists of 10 continers on network startup: 3 peers (one for each org), 3 CLIs (one for each org), 3 CAs (one for each org) and 1 orderer peer (assumed to be owned by a 4th organization). 
- User and Admin credential creations js files have been done for all three Orgs.
- Transaction 1 and Application 1 done - Registration of patient on blockchain
- Peronal Details Query and application done - Displayin the personal details and status of the patient
<br> 
#### Work to be done:
- Transaction 2 and Application 2 - Request for PHC treatment
- Transaction 3 and Application 3 - Treatment at PHC
- Transaction 4 and Application 4 - Referral from PHC to Government Hospital
- Transaction 5 and Application 5 - Treatment at Government Hospital
- Query and application of PHC Treatment Details
- Query and application of Govt Hosp Treatment Details 

## Usage Instructions

### Installation Instructions
- Tested and works on Ubuntu 16.04 and 18.04. Please refer to https://hyperledger-fabric.readthedocs.io/en/release-1.4/getting_started.html for installation instructions of hyperledger fabric. 
- During the <b>'Install Samples, Binaries and Docker Images'</b>, please only install v 1.4.2 through the following curl command:
<b>curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.2 1.4.2 0.4.15</b>
- Clone the 'Blockchain_Project' repo into the downloaded fabric-samples directory.

### Network Set-up Instructions
- Open terminal in the Inner_Circle folder
- (Optional) Run the startpart1.sh file if you want to re-generate the cryptogen material and the channel artifacts, not needed because default material and artifacts already exist. Terminal Command: ./startpart1.sh
- Run the byfn.sh file to bring up the network. It will create the channel, add the peers to the channel, install the referral contract, instantiate the referral contract and run the instantiate function in the contract. Terminal Command: ./byfn.sh

### Example of invoking a transaction - Transaction 1, registration of patient on the blockchain
- Go to Inner_Circle/application/Patient. Terminal command (if inside Inner_Circle folder): cd application/patient
- Run the npm install command to download all the packages and dependencies (No need if node_modules folder already exists in the application directory). Terminal command: npm install 
- Run the enrollAdmin.js file to obtain admin wallet credentials (certificate and private key). Terminal command: node enrollAdmin.js
- Run the registerUser.js file to obtain user 1 wallet credentials (certificate and private key). Terminal Command: node registerUser.js
- Run the first transaction application. Terminal Command: node Transactions/RegisterPatient.js


