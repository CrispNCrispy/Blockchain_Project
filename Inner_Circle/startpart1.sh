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
../bin/configtxgen -profile OrdererGenesis -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block
export CHANNEL_NAME=channel13
export CHANNEL_PROFILE=Channel13

echo
echo "#################################################################"
echo "####################    Generating channel13  ###################"
echo "#################################################################"

../bin/configtxgen -profile ${CHANNEL_PROFILE} -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for channel13  #########"
echo "#################################################################"

echo "#######    Generating anchor peer update for Patient #########"
../bin/configtxgen -profile ${CHANNEL_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PatientMSPanchors_${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME -asOrg PatientMSP

echo "#######    Generating anchor peer update for GovtHos #### "
../bin/configtxgen -profile ${CHANNEL_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/GovtHosMSPanchors_${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME -asOrg GovtHosMSP

echo "#######    Generating anchor peer update for PHC #########"
../bin/configtxgen -profile ${CHANNEL_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/PHCMSPanchors_${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME -asOrg PHCMSP
