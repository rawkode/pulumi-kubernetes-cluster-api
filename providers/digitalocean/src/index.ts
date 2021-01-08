import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

const VERSION = "0.4.1";

export interface ProviderConfig {
	kubernetesProvider: kubernetes.Provider;
	clusterApi: kubernetes.yaml.ConfigFile;
	accessToken: string | pulumi.OutputInstance<string>;
}

export interface Provider {
	capdo: kubernetes.yaml.ConfigFile;
}

export const init = (config: ProviderConfig): Provider => {
	return {
		capdo: new kubernetes.yaml.ConfigFile(
			"cluster-api-packet-digitalocean",
			{
				file: `https://github.com/kubernetes-sigs/cluster-api-provider-digitalocean/releases/download/v${VERSION}/infrastructure-components.yaml`,
				transformations: [
					(obj: any) => {
						if (
							obj.kind === "Secret" &&
							obj.metadata.name === "capdo-manager-bootstrap-credentials"
						) {
							obj.data = undefined;
							obj.stringData = {};

							obj.stringData.credentials = config.accessToken;
						}
					},
				],
			},
			{
				provider: config.kubernetesProvider,
				dependsOn: [config.clusterApi],
			}
		),
	};
};
