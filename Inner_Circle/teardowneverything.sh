export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/patient.example.com/ca && ls *_sk)
export BYFN_CA2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/govthos.example.com/ca && ls *_sk)
export BYFN_CA3_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/phc.example.com/ca && ls *_sk)
echo "==================="
echo "Teardown everything"
echo "==================="
#docker-compose down -v
docker-compose -f docker-compose.yaml -f docker-compose-ca.yaml down --volumes --remove-orphans  
docker rm -f $(docker ps -aq) && docker rmi $(docker images dev-* -q)
docker ps -a
rm -rf application/Patient/wallet
rm -rf application/GovtHos/wallet
rm -rf application/PHC/wallet
echo "########### Closing Network ##################"
echo
echo "================="
echo "Teardown complete"
echo "================="



