#!/usr/bin/env bash

: "${FABRIC_VERSION:=1.4.1}"
: "${FABRIC_CA_VERSION:=1.4.1}"

# if the binaries are not available, download them
if [[ ! -d "bin" ]]; then
  curl -sSL http://bit.ly/2ysbOFE | bash -s -- ${FABRIC_VERSION} ${FABRIC_CA_VERSION} 0.4.14 -ds
fi

rm -rf ./crypto-config/
rm -f ./orgs.genesis.block
rm -f ./mychannel.tx

# The below assumes you have the relevant code available to generate the cryto-material
./bin/cryptogen generate --config=./crypto-config.yaml
./bin/configtxgen -profile OrgsOrdererGenesis -outputBlock orgs.genesis.block -channelID syschannel
./bin/configtxgen -profile OrgsChannel -outputCreateChannelTx mychannel.tx -channelID mychannel

# Rename the key files we use to be key.pem instead of a uuid
for KEY in $(find crypto-config -type f -name "*_sk"); do
    KEY_DIR=$(dirname ${KEY})
    mv ${KEY} ${KEY_DIR}/key.pem
done
