#go run Block_Inter.go
echo "==================="
echo "Teardown everything"
echo "==================="
docker-compose down -v
docker-compose -f docker-compose.yaml -f docker-compose-ca.yaml down --volumes --remove-orphans  
docker rm $(docker ps -aq) && docker rmi $(docker images dev-* -q)
docker ps -a
echo "########### Closing Network ##################"
echo
echo "================="
echo "Teardown complete"
echo "================="



