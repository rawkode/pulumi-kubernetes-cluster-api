import { CustomResource, Output } from "@pulumi/pulumi";
import { types } from "@pulumi/kubernetes";

export type MachineTemplate = CustomResource & MachineTemplateImpl;

interface MachineTemplateImpl {
	apiVersion: Output<string | undefined>;
	kind: Output<string | undefined>;
	metadata: Output<types.input.meta.v1.ObjectMeta | undefined>;

	preKubeadmCommands: string[];
	postKubeadmCommands: string[];
}
