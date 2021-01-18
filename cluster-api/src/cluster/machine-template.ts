import { CustomResource, Output } from "@pulumi/pulumi";

export type MachineTemplate = CustomResource & MachineTemplateImpl;

interface MachineTemplateImpl {
	apiVersion: Output<string | undefined>;
	kind: Output<string | undefined>;
	metadata: {
		name: Output<string | undefined>;
	};

	preKubeadmCommands: string[];
	postKubeadmCommands: string[];
}
