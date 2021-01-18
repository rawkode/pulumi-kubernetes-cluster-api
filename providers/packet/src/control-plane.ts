import * as kubernetes from "@pulumi/kubernetes";
import { CustomResource } from "@pulumi/pulumi";
import * as capp from "@rawkode/pulumi-kubernetes-cluster-api-types-packet";

import Facility from "./facility";

export interface InfrastructureConfig {
	name: string;
	projectID: string;
	facility: Facility | string;
	kubernetesProvider: kubernetes.Provider;
}

export interface Infrastructure {
	cluster: CustomResource;
	machineTemplate: CustomResource;
}

export const create = (config: InfrastructureConfig): Infrastructure => {
	const cluster = new capp.infrastructure.v1alpha3.PacketCluster(config.name, {
		spec: {
			projectID: config.projectID,
			facility: config.facility,
		},
	});

	const machineTemplate = new capp.infrastructure.v1alpha3.PacketMachineTemplate(
		`${config.name}-control-plane`,
		{
			spec: {
				template: {
					spec: {
						OS: "",
						billingCycle: "",
						machineType: "",
						sshKeys: [],
						tags: [],
					},
				},
			},
		}
	);

	return {
		cluster,
		machineTemplate,
	};
};
