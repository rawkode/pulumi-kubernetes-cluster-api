import { CustomResource, Output } from "@pulumi/pulumi";

export type MachineTemplate = CustomResource & MachineTemplateImpl;

interface MachineTemplateImpl {
	apiVersion: Output<string>;
	kind: Output<string>;
	metadata: {
		name: Output<string>;
	};

	preKubeadmCommands: string[];
	postKubeadmCommands: string[];
}
