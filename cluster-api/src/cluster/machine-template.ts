import { CustomResource, Output } from "@pulumi/pulumi";
import { types } from "@pulumi/kubernetes";

export interface KubernetesCustomResource {
	apiVersion: Output<string | undefined>;
	kind: Output<string | undefined>;
	metadata: Output<types.input.meta.v1.ObjectMeta | undefined>;
}
export interface MachineTemplate {
	machineTemplate: CustomResource & KubernetesCustomResource;
	preKubeadmCommands: string[];
	postKubeadmCommands: string[];
}
