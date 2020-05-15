#!/bin/bash

# Reusing the crypto materials- have configered to the current crypto. Dont delete the previous one.
sudo rm -R channel-artifacts/
sudo rm -R crypto-config/

export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/config:/var/hyperledger/config
${PWD}
OS_ARCH=$(echo "$(uname -s | tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')

../bin/cryptogen generate --config=./crypto-config.yaml
mkdir channel-artifacts && export FABRIC_CFG_PATH=$PWD

echo
echo "##########################################################"
echo "#########  Generating Orderer Genesis block ##############"
echo "##########################################################"
../bin/configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block
export CHANNEL_ONE_NAME=channelall
export CHANNEL_ONE_PROFILE=ChannelAll
export CHANNEL_TWO_NAME=channel13
export CHANNEL_TWO_PROFILE=Channel13

echo
echo "#################################################################"
echo "#######    Generating channelall and channel13  #################"
echo "#################################################################"

../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputCreateChannelTx ./channel-artifacts/${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME

../bin/configtxgen -profile ${CHANNEL_TWO_PROFILE} -outputCreateChannelTx ./channel-artifacts/${CHANNEL_TWO_NAME}.tx -channelID $CHANNEL_TWO_NAME

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for channelall #########"
echo "#################################################################"

echo "#######    Generating anchor peer update for Patient #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PatientMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg PatientMSP

echo "#######    Generating anchor peer update for GovtHos #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/GovtHosMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg GovtHosMSP

echo "#######    Generating anchor peer update for PHC #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PHCMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg PHCMSP

echo "#######    Generating anchor peer update for PvtHos #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PvtHosMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg PvtHosMSP

echo "#######    Generating anchor peer update for Research #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/ResearchMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg ResearchMSP

echo "#######    Generating anchor peer update for Insurance #########"
../bin/configtxgen -profile ${CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/InsuranceMSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $CHANNEL_ONE_NAME -asOrg InsuranceMSP

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for channel13  #########"
echo "#################################################################"

echo "#######    Generating anchor peer update for Patient #########"
../bin/configtxgen -profile ${CHANNEL_TWO_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PatientMSPanchors_${CHANNEL_TWO_NAME}.tx -channelID $CHANNEL_TWO_NAME -asOrg PatientMSP

echo "#######    Generating anchor peer update for GovtHos #### "
../bin/configtxgen -profile ${CHANNEL_TWO_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/GovtHosMSPanchors_${CHANNEL_TWO_NAME}.tx -channelID $CHANNEL_TWO_NAME -asOrg GovtHosMSP
echo "#######    Generating anchor peer update for PHC #########"
../bin/configtxgen -profile ${CHANNEL_TWO_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PHCMSPanchors_${CHANNEL_TWO_NAME}.tx -channelID $CHANNEL_TWO_NAME -asOrg PHCMSP

docker-compose up -d