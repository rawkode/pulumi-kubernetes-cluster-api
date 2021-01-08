import * as kubernetes from "@pulumi/kubernetes";
import * as capi from "@rawkode/pulumi-kubernetes-cluster-api";
import { init } from "@rawkode/pulumi-kubernetes-cluster-api-digitalocean";

const kubernetesProvider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

const { clusterApi } = capi.init({
	installCertManager: false,
	kubernetesProvider,
});

const capdo = init({
	accessToken: "abc123",
	clusterApi,
	kubernetesProvider,
});
