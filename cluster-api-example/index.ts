import * as kubernetes from "@pulumi/kubernetes";
import { init } from "@rawkode/pulumi-kubernetes-cluster-api";
import { createSecretResourceSet } from "@rawkode/pulumi-kubernetes-cluster-api/bin/resource-sets";

const kubernetesProvider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

export const clusterApi = init({
	installCertManager: false,
	kubernetesProvider,
});

export const secretResourceSet = createSecretResourceSet(
	kubernetesProvider,
	"my-secret",
	"default",
	[
		{
			key: "my-key",
			value: "my-value",
		},
	]
);
