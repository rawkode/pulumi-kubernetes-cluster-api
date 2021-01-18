import * as kubernetes from "@pulumi/kubernetes";
import { KubernetesCustomResource } from "@rawkode/pulumi-kubernetes-cluster-api";
import { ControlPlaneSpec } from "@rawkode/pulumi-kubernetes-cluster-api/cluster";
import * as capp from "@rawkode/pulumi-kubernetes-cluster-api-types-packet";

import Facility from "./facility";
import { Image } from "./images";

export interface InfrastructureConfig {
	name: string;
	projectID: string;
	facility: Facility | string;
	image: Image;
	machineType: string;
	replicas: number;
	kubernetesProvider: kubernetes.Provider;
}

export interface Infrastructure {
	cluster: KubernetesCustomResource;
	controlPlane: ControlPlaneSpec;
}

export const create = (config: InfrastructureConfig): Infrastructure => {
	const cluster = new capp.infrastructure.v1alpha3.PacketCluster(
		config.name,
		{
			spec: {
				projectID: config.projectID,
				facility: config.facility,
			},
		},
		{
			provider: config.kubernetesProvider,
		}
	);

	const machineTemplate = new capp.infrastructure.v1alpha3.PacketMachineTemplate(
		`${config.name}-control-plane`,
		{
			spec: {
				template: {
					spec: {
						OS: config.image.id(),
						billingCycle: "Hourly",
						machineType: config.machineType,
						sshKeys: [],
						tags: [],
					},
				},
			},
		},
		{
			provider: config.kubernetesProvider,
		}
	);

	return {
		cluster,
		controlPlane: {
			replicas: config.replicas,
			machineTemplate: {
				machineTemplate,
				preKubeadmCommands: config.image.preKubeadmCommands(),
				postKubeadmCommands: config.image.postKubeadmCommands(),
			},
		},
	};
};
