# Demonstration of Patient-centric on a Bank Network
Authentication demo on a Patient-centric Network using Hyperledger Fabric. The Patient-centric Network is composed of six organizations: Patient, PHC, Govt Hospital, Pvt. Hospitals, Insurance and Research Institutes. Each Organisation has one peer node. There are two channel in the network. 1st  channel consits  of Patient, PHC and Govt. Hospital  organisations. Second channel consists of all seven organisation.

## Step 0: prepare a Fabric Node
Go to the fabric-samples folder which is present in the directory where you have install hyperledger fabric on your machine. 
```
cd fabric-samples
```

## Step 1: bring up everything for demonstration
If the network is being setup for the first time, then proceed with this code: 
```
./startpart1.sh
./byfn.sh
```
Else the network has already been setup once, the crypto materials can be reused for the current crypto.
```
./byfn.sh 
```

## Step 2: Install the required SDK
```
npm install
```

## Step 3: Enrol user-alpha and user-beta in the wallet
```
node enrollAdmin-patient.js
node registerUser-patient.js

//node enrollAdmin-GovtHos.js
//node registerUser-GovtHos .js

ls wallet
```
## Step 4: Perform client applications.
Substitute *bank* with **patient** or **govthos** to reflect which bank runs the client application.

Initialize a new invoice for a company: `node initInv-patient.js <company> <invno> <invamount>`. For example,
```
node initInv-patient.js Alice inv-bob001 10000
```

Query an existing invoice: `node queryInv-bank.js <company> <invno>`. For example,
```
node queryInv-patient.js Alice inv-bob001
```

Request loan on an existing invoice: `node requestLoan-bank.js <company> <invno> <loanamt>`. For example,
```
node requestLoan-patient.js Alice inv-bob001 7000
```

You can try any combination of command, simulating query from other bank, or company applies amount exceeding the invoice amount, etc.

##Step 5: When the referral has to be made between Patient, PHC and Govt. Hospital
```
go run Block_Inter.go 
 
```

## Step 6: Clean up
```
./teardowneverything.sh
```

**End**
