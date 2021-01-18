import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as capi from "@rawkode/pulumi-kubernetes-cluster-api-types";
import * as ipCidr from "ip-cidr";

import { InfrastructureProvider } from "./infrastructure-provider";
import { MachineTemplate } from "./machine-template";

export interface Config {
	name: string;
	kubernetesVersion: string;
	kubernetesProvider: kubernetes.Provider;

	podCidr: ipCidr;
	serviceCidr: ipCidr;
}

interface ControlPlaneSpec {
	replicas: number;
	machineTemplate: MachineTemplate;
}
interface Cluster {
	cluster: capi.cluster.v1alpha3.Cluster;
}

export const create = (
	config: Config,
	infra: InfrastructureProvider,
	controlPlaneSpec: ControlPlaneSpec
): Cluster => {
	const controlPlane = new capi.controlplane.v1alpha3.KubeadmControlPlane(
		config.name,
		{
			spec: {
				replicas: controlPlaneSpec.replicas,
				version: config.kubernetesVersion,
				infrastructureTemplate: {
					apiVersion: pulumi.interpolate`${controlPlaneSpec.machineTemplate.apiVersion}`,
					kind: pulumi.interpolate`${controlPlaneSpec.machineTemplate.kind}`,
					name: pulumi.interpolate`${controlPlaneSpec.machineTemplate.metadata.name}`,
				},
				kubeadmConfigSpec: {
					preKubeadmCommands:
						controlPlaneSpec.machineTemplate.preKubeadmCommands,
					postKubeadmCommands:
						controlPlaneSpec.machineTemplate.postKubeadmCommands,
					clusterConfiguration: {
						apiServer: {
							extraArgs: {
								"cloud-provider": "external",
							},
						},
						controllerManager: {
							extraArgs: {
								"cloud-provider": "external",
							},
						},
					},
					initConfiguration: {
						nodeRegistration: {
							kubeletExtraArgs: {
								"cloud-provider": "external",
							},
						},
					},
					joinConfiguration: {
						nodeRegistration: {
							kubeletExtraArgs: {
								"cloud-provider": "external",
							},
						},
					},
				},
			},
		}
	);

	const cluster = new capi.cluster.v1alpha3.Cluster(
		config.name,
		{
			metadata: {
				name: config.name,
				labels: {
					"cluster-name": config.name,
				},
			},
			spec: {
				clusterNetwork: {
					pods: {
						cidrBlocks: [config.podCidr.toString()],
					},
					services: {
						cidrBlocks: [config.serviceCidr.toString()],
					},
				},
				controlPlaneRef: {
					// ¯\_(ツ)_/¯
					// Not sure if this is a crd2pulumi bug, or a bug in the CRDs
					// themselves; but a little type juggling is required.
					// I'll come back to this ... promise.
					apiVersion: pulumi.interpolate`${controlPlane.apiVersion}`,
					kind: pulumi.interpolate`${controlPlane.kind}`,
					name: controlPlane.metadata.apply(
						(m): pulumi.Output<string> => pulumi.interpolate`${m?.name}`
					),
				},
				infrastructureRef: {
					apiVersion: pulumi.interpolate`${infra.apiVersion}`,
					kind: pulumi.interpolate`${infra.kind}`,
					name: pulumi.interpolate`${infra.metadata?.name}`,
				},
			},
		},
		{
			provider: config.kubernetesProvider,
			dependsOn: [controlPlane],
		}
	);

	return {
		cluster,
	};
};
