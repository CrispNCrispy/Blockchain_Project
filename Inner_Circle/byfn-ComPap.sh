#!/bin/bash

export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/patient.example.com/ca && ls *_sk)
export BYFN_CA2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/govthos.example.com/ca && ls *_sk)
export BYFN_CA3_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/phc.example.com/ca && ls *_sk)

docker-compose -f docker-compose.yaml -f docker-compose-ca.yaml up -d
docker ps -a

echo "Executing the script now"
#scripts/script.sh
#This file creates the channel and makes the peers connect to it
docker exec cli scripts/script.sh

echo
echo "====================="
echo "install chaincode inv "
echo "====================="
echo "--to peer0.Patient.example.com--"
docker exec cli peer chaincode install -n papercontract -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/contract
echo "--to peer0.GovtHospital.example.com--"
docker exec -e CORE_PEER_ADDRESS=peer0.govthos.example.com:8051 -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/peers/peer0.govthos.example.com/tls/ca.crt -e CORE_PEER_LOCALMSPID="GovtHosMSP" -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/users/Admin@govthos.example.com/msp cli peer chaincode install -n papercontract -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/contract
echo "--to peer0.PHC.example.com--"
docker exec -e CORE_PEER_ADDRESS=peer0.phc.example.com:9051 -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/peers/peer0.phc.example.com/tls/ca.crt -e CORE_PEER_LOCALMSPID="PHCMSP" -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/users/Admin@phc.example.com/msp cli peer chaincode install -n papercontract -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/contract


echo
echo "========================="
echo "instantiate chaincode on Channel13"
echo "========================="
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C channel13 -n papercontract -v 1.0 -c '{"Args":[]}' -P "AND ('PatientMSP.peer','GovtHosMSP.peer','PHCMSP.peer')"

echo
echo "=========================================="
echo "Everything is Ready. Go for client scripts"
echo "=========================================="
