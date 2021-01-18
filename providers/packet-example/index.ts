import * as kubernetes from "@pulumi/kubernetes";
import * as capi from "@rawkode/pulumi-kubernetes-cluster-api";
import {
	init,
	createControlPlane,
} from "@rawkode/pulumi-kubernetes-cluster-api-packet";
import Facility from "@rawkode/pulumi-kubernetes-cluster-api-packet/facility";
import IPCidr from "ip-cidr";

const kubernetesProvider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

// const { clusterApi } = capi.init({
// 	installCertManager: false,
// 	kubernetesProvider,
// });

// const packet = init({
// 	apiKey: "abc123",
// 	clusterApi,
// 	kubernetesProvider,
// });

const clusterName = "rawkode";
const projectID = "";

const { cluster, controlPlane } = createControlPlane({
	facility: Facility.AM6,
	kubernetesProvider,
	name: clusterName,
	projectID,
});

const myCluster = capi.createCluster(
	{
		name: "rawkodes-cluster",
		kubernetesVersion: "1.19.4",
		podCidr: new IPCidr("10.0.0.0/24"),
		serviceCidr: new IPCidr("192.168.86.0/24"),
		kubernetesProvider,
	},
	cluster,
	controlPlane
);
