import { CustomResource, Output } from "@pulumi/pulumi";

export type InfrastructureProvider = CustomResource & InfrastructureCluster;

interface InfrastructureCluster {
	apiVersion: Output<string>;
	kind: Output<string>;
	metadata: {
		name: Output<string>;
	};
}
