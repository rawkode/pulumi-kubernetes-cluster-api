import { CustomResource, Output } from "@pulumi/pulumi";

export type InfrastructureProvider = CustomResource & InfrastructureCluster;

interface InfrastructureCluster {
	apiVersion: Output<string | undefined>;
	kind: Output<string | undefined>;
	metadata: {
		name: Output<string | undefined>;
	};
}
