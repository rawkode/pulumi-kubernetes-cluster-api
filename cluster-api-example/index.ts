import * as kubernetes from "@pulumi/kubernetes";
import { init } from "@rawkode/pulumi-kubernetes-cluster-api";

const kubernetesProvider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

export const clusterApi = init({
	installCertManager: false,
	kubernetesProvider,
});
