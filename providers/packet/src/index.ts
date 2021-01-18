import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import { PacketMachineTemplate } from "@rawkode/pulumi-kubernetes-cluster-api-types-packet/infrastructure/v1alpha3";

const VERSION = "0.3.8";

export interface ProviderConfig {
	kubernetesProvider: kubernetes.Provider;
	clusterApi: kubernetes.yaml.ConfigFile;
	apiKey: string | pulumi.OutputInstance<string>;
}

export interface Provider {
	capp: kubernetes.yaml.ConfigFile;
}

class OSPacketMachineTemplate extends PacketMachineTemplate {
	preKubeadmCommands: string[];
	postKubeadmCommands: string[];
}

export const init = (config: ProviderConfig): Provider => {
	return {
		capp: new kubernetes.yaml.ConfigFile(
			"cluster-api-packet-provider",
			{
				file: `https://github.com/kubernetes-sigs/cluster-api-provider-packet/releases/download/v${VERSION}/infrastructure-components.yaml`,
				transformations: [
					(obj: any) => {
						if (obj.kind == "Namespace" && obj.metadata.name === "system") {
							obj.metadata.name = "cluster-api-provider-packet-system";
						}

						if (
							obj.kind === "Secret" &&
							obj.metadata.name ===
								"cluster-api-provider-packet-manager-api-credentials"
						) {
							obj.stringData.PACKET_API_KEY = config.apiKey;
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

export { create as createControlPlane } from "./control-plane";
