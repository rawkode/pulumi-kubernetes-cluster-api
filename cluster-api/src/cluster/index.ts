import * as kubernetes from "@pulumi/kubernetes";
import * as ipCidr from "ip-cidr";

interface Config {
	name: string;
	kubernetesVersion: string;
	kubernetesProvider: kubernetes.Provider;

	podCidr: ipCidr;
	serviceCidr: ipCidr;
}

type Cluster = Config;

const createCluster = (config: Config): Cluster => {
	return config;
};
