# Blockchain Project: E-Referral of a Patient from a PHC to a Government Hosital using Hyperledger Fabric<br>

## Status: Complete<br>
## IMPORTANT NOTE: Only works with v1.4.2, please do not use any other version!<br>

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
- Transaction 2 and Application 2 - Request for PHC treatment
- Transaction 3 and Application 3 - Treatment at PHC
- Transaction 4 and Application 4 - Referral Issue by PHC
- Transaction 5 and Application 5 - Referral Acceptance by Government Hospital
- Transaction 6 and Application 6 - Treatment at Government Hospital
- Query 1 - Peronal Details Query and application - Displaying the personal details and status of the patient
- Query 2 - All Latest Details Query and applicaiton - To display all current world state details of the patient

#### Work to be done:
- Create couchdb container 
- Implement data masking

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

### Example of invoking a transaction - Transaction 1, registration of patient on the blockchain (Note: Detailed README.md of all the applications is present in the applications directory)
- Go to Inner_Circle/application/Patient. Terminal command (if inside Inner_Circle folder): cd application/patient
- Run the npm install command to download all the packages and dependencies (No need if node_modules folder already exists in the application directory). Terminal command: npm install 
- Run the enrollAdmin.js file to obtain admin wallet credentials (certificate and private key). Terminal command: node enrollAdmin.js
- Run the registerUser.js file to obtain user 1 wallet credentials (certificate and private key). Terminal Command: node registerUser.js
- Run the first transaction application. Terminal Command (Run from the Patient Directory): node Transactions/RegisterPatient.js Chris 12345 Pinto 1997-12-06 cpinto4u@gmail.com 9986981226 8762626326 Kadri,\ Mangalore A+ (note: on terminal "\ " would indicate a space in the text fields passed to the application)

## Benchmarking: Hyperledger Caliper
Check out the report.html in the caliper-benchmarking folder for the most recent benchmarks.

#### Structure of Caliper
There are three components, the network, the benchmark configs and the chaincode.
- Network: There are three main directories that constitutes the network. First, the network directory (for example, fabric v1.4.2) which contains the main network config files which holds all the information about the topology - peers, orderes, chaincodes and certificate authorities. The second is the directory containing the crypto material and channel artefacts (for example, config_solo). The third is the directoy containing the docker compose files to be run.
- Benchmark Configuration: There are two main componenets that constitutes the benchmark configuration section, the main config file and the javascript files for each transaction workload definitions. The config file contains all the information pertaining to the different transactions to be benchmarked and the processes to be observed during the benchmarking. It will also contain the paths to the javascript files for the individual transactions (workload files). The workload files are used for defining how the transactions are to be submitted through the config files. 
- Chaincode: The chaincode can directly be copied to the caliper-benchmarks/src/fabric/scenario. The location to the chaincode has to be put the main network configuration file under the chaincodes section along with the name and version number. Ensure that the chaincode has an 'init' function. If there isn't, create an init funcion with an empty return.
