# About the network

This directory contains a sample __Fabric__ network with the following properties.

## Topology
* The network has 2 participating organizations.
* The network has 1 orderer node in solo mode.
* Each organization has 1 peer in the network.
* The peers use __CouchDB__ as the world-state database.
* A channel named `mychannel` is created and the peers are joined.
* A sample chaincode is installed and instantiated. See the [configuration section](#platform-configurations) for details.

## Communication protocol
* The `docker-compose.yaml` file specifies a network __without TLS__ communication.
* The `docker-compose-tls.yaml` file specifies a network __with TLS__ communication.

The configuration files names (with or without the `-tls` part) indicate which network type it relies on. They are not distinguished further in the next sections.

## Metrics
* The `docker-compose-prometheus.yaml` file specifies a network that publishes Prometheus metrics. See the following for the available metrics: https://hyperledger-fabric.readthedocs.io/en/release-1.4/metrics_reference.html

*NOTE*: 
* Prometheus metrics are only available on Fabric v1.4.0 and above
* `docker-compose-prometheus.yaml` relies on the companion network `/prometheus-grafana/docker-compose-fabric.yml` being stood up in advance as they must exist on the same docker network

## Versions
An export is used to configure the appropriate level network, based on the following map:

- Fabric v1.0 : x86_64-1.0.0
- Fabric 1.1.X : 1.1.X
- Fabric 1.2.X : 1.2.X
- Fabric 1.3.X : 1.3.X
- Fabric 1.4.X : 1.4.X