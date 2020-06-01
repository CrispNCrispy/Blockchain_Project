#!/bin/bash

export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/patient.example.com/ca && ls *_sk)
export BYFN_CA2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/govthos.example.com/ca && ls *_sk)
export BYFN_CA3_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/phc.example.com/ca && ls *_sk)

docker-compose -f docker-compose.yaml -f docker-compose-ca.yaml up -d
docker ps -a

echo "Executing the script now"
#This file creates the channel and connects the peers to it
docker exec cliPatient scripts/script.sh

echo
echo "==================================="
echo "install chaincode referralcontract "
echo "==================================="

echo "--to peer0.patient.example.com--"

docker exec \
  -e CORE_PEER_LOCALMSPID="PatientMSP" \
  -e CORE_PEER_ADDRESS=peer0.patient.example.com:7051 \
  -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/users/Admin@patient.example.com/msp \
  -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/peers/peer0.patient.example.com/tls/ca.crt \
  cliPatient \
  peer chaincode install \
    -n referralcontract \
    -v 1.0 \
    -p /opt/gopath/src/github.com/chaincode/referral \
    -l node

echo "--to peer0.govthos.example.com--"
docker exec \
  -e CORE_PEER_LOCALMSPID="GovtHosMSP" \
  -e CORE_PEER_ADDRESS=peer0.govthos.example.com:8051 \
  -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/users/Admin@govthos.example.com/msp \
  -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/peers/peer0.govthos.example.com/tls/ca.crt \
  cliGovtHos \
  peer chaincode install \
    -n referralcontract \
    -v 1.0 \
    -p /opt/gopath/src/github.com/chaincode/referral \
    -l node

echo "--to peer0.phc.example.com--"
docker exec \
  -e CORE_PEER_LOCALMSPID="PHCMSP" \
  -e CORE_PEER_ADDRESS=peer0.phc.example.com:9051 \
  -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/users/Admin@phc.example.com/msp \
  -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/peers/peer0.phc.example.com/tls/ca.crt \
  cliPHC \
  peer chaincode install \
    -n referralcontract \
    -v 1.0 \
    -p /opt/gopath/src/github.com/chaincode/referral \
    -l node


echo
echo "=================================="
echo "instantiate chaincode on channel13"
echo "=================================="

docker exec \
  -e CORE_PEER_LOCALMSPID="PatientMSP" \
  -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/users/Admin@patient.example.com/msp \
  cliPatient \
  peer chaincode instantiate \
    -o orderer.example.com:7050 \
    -C channel13 \
    -n referralcontract \
    -l node \
    -v 1.0 \
    -c '{"Args":[]}' \
    -P "AND('PatientMSP.peer','GovtHosMSP.peer','PHCMSP.peer')" \
    --tls \
    --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses peer0.patient.example.com:7051 \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/peers/peer0.patient.example.com/tls/ca.crt

echo "Waiting for instantiation request to be committed ..."
sleep 10

echo "Submitting instantiate transaction to smart contract on channel13"
echo "The transaction is sent to all of the peers so that chaincode is built before receiving the following requests"
docker exec \
  -e CORE_PEER_LOCALMSPID="PatientMSP" \
  -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/users/Admin@patient.example.com/msp \
  cliPatient \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C channel13 \
    -n referralcontract \
    -c '{"function":"instantiate","Args":[]}' \
    --waitForEvent \
    --tls \
    --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses peer0.patient.example.com:7051 \
    --peerAddresses peer0.govthos.example.com:8051 \
    --peerAddresses peer0.phc.example.com:9051 \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/peers/peer0.patient.example.com/tls/ca.crt \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/peers/peer0.govthos.example.com/tls/ca.crt \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/peers/peer0.phc.example.com/tls/ca.crt

rm -rf wallet

echo
echo "=========================================="
echo "Everything is Ready. Go for client scripts"
echo "=========================================="
