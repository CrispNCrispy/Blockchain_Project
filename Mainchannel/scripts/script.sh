#!/bin/bash

echo "##################  Step 5: Step 5: bring up three terminals for easy demonstration and set the orderer CA ###################"
echo "################## FOR Patient ######################"
docker exec -it cli bash 
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################"
peer channel create -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/channelall.tx --tls --cafile $ORDERER_CA
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/PatientMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3: Join for channel13 ################"
peer channel create -o orderer.example.com:7050 -c channel13 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/channel13.tx --tls --cafile $ORDERER_CA
peer channel join -b channel13.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channel13 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/PatientMSPanchors_channel13.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.4. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure Patient Done ******************####"


echo "################## FOR govthos ######################"
#docker exec -e "CORE_PEER_LOCALMSPID=GovtHosMSP" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GovtHos.example.com/peers/peer0.GovtHos.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GovtHos.example.com/users/Admin@GovtHos.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.GovtHos.example.com:7051" -it cli bash
CORE_PEER_LOCALMSPID="GovtHosMSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/peers/peer0.govthos.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/govthos.example.com/users/Admin@govthos.example.com/msp
CORE_PEER_ADDRESS=peer0.govthos.example.com:8051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################"
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/GovtHosMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3: Join for channel13 ################"
peer channel join -b channel13.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channel13 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/GovtHosMSPanchors_channel13.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.4. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure govthos Done ******************####"


echo "################## FOR PHC ######################"
#docker exec -e "CORE_PEER_LOCALMSPID=PHCMSP" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/PHC.example.com/peers/peer0.PHC.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/PHC.example.com/users/Admin@PHC.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.PHC.example.com:7051" -it cli bash
CORE_PEER_LOCALMSPID="PHCMSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/peers/peer0.phc.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/phc.example.com/users/Admin@phc.example.com/msp
CORE_PEER_ADDRESS=peer0.phc.example.com:9051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################"
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/PHCMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3: Join for channel13 ################"
peer channel join -b channel13.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channel13 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/PHCMSPanchors_channel13.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.4. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure PHC Done ******************####"

echo "################## FOR PvtHos ######################"
#docker exec -e "CORE_PEER_LOCALMSPID=PvtHosMSP" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/PvtHos.example.com/peers/peer0.PvtHos.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/PvtHos.example.com/users/Admin@PvtHos.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.PvtHos.example.com:7051" -it cli bash
CORE_PEER_LOCALMSPID="PvtHosMSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/pvthos.example.com/peers/peer0.pvthos.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/pvthos.example.com/users/Admin@pvthos.example.com/msp
CORE_PEER_ADDRESS=peer0.pvthos.example.com:10051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################"
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/PvtHosMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure PvtHos Done ******************####"

echo "################## FOR Research ######################"
#docker exec -e "CORE_PEER_LOCALMSPID=ResearchMSP" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Research.example.com/peers/peer0.Research.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Research.example.com/users/Admin@Research.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.Research.example.com:7051" -it cli bash
CORE_PEER_LOCALMSPID="ResearchMSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/research.example.com/peers/peer0.research.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/research.example.com/users/Admin@research.example.com/msp
CORE_PEER_ADDRESS=peer0.research.example.com:11051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################" 
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/ResearchMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure research Done ******************####"

echo "################## FOR Insurance ######################"
#docker exec -e "CORE_PEER_LOCALMSPID=InsuranceMSP" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Insurance.example.com/peers/peer0.Insurance.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Insurance.example.com/users/Admin@Insurance.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.Insurance.example.com:7051" -it cli bash
CORE_PEER_LOCALMSPID="InsuranceMSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/insurance.example.com/peers/peer0.insurance.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/insurance.example.com/users/Admin@insurance.example.com/msp
CORE_PEER_ADDRESS=peer0.insurance.example.com:12051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "##################  Step 5.2: Step 5: create and join channel ###################"
echo "##################  Step 5.2: For channelall ###################"
peer channel join -b channelall.block --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/InsuranceMSPanchors_channelall.tx --tls --cafile $ORDERER_CA
echo "################## Step 5.3. Finishing Updates ################"
echo "###############Step 6: Check each peer the channel(s) it has joint.################# "
peer channel list
echo "###************** Configure Insurance Done ******************####"

