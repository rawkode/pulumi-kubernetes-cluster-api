import * as kubernetes from "@pulumi/kubernetes";
import * as capi from "@rawkode/pulumi-kubernetes-cluster-api";
import { Runtime } from "@rawkode/pulumi-kubernetes-cluster-api/runtimes";
import {
	init,
	createControlPlane,
} from "@rawkode/pulumi-kubernetes-cluster-api-packet";
import Facility from "@rawkode/pulumi-kubernetes-cluster-api-packet/facility";
import { Ubuntu2010 } from "@rawkode/pulumi-kubernetes-cluster-api-packet/images/";
import IPCidr from "ip-cidr";

const kubernetesProvider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

const { clusterApi } = capi.init({
	installCertManager: true,
	certManagerVersion: "1.1.0",
	kubernetesProvider,
});

const packet = init({
	apiKey: "abc123",
	clusterApi,
	kubernetesProvider,
});

const clusterName = "rawkode";
const projectID = "";

const { cluster, controlPlane } = createControlPlane({
	facility: Facility.AM6,
	kubernetesProvider,
	name: clusterName,
	projectID,
	image: new Ubuntu2010("1.19.4", Runtime.containerd),
	machineType: "c3.xlarge.x86",
	replicas: 1,
});

const myCluster = capi.createCluster(
	{
		name: "rawkodes-cluster",
		kubernetesVersion: "1.19.4",
		podCidr: new IPCidr("192.168.0.0/16"),
		serviceCidr: new IPCidr("172.26.0.0/16"),
		kubernetesProvider,
	},
	cluster,
	controlPlane
);
