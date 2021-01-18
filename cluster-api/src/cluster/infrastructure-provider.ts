import { CustomResource, Output } from "@pulumi/pulumi";
import { types } from "@pulumi/kubernetes";

export type InfrastructureProvider = CustomResource & InfrastructureCluster;

interface InfrastructureCluster {
	apiVersion: Output<string | undefined>;
	kind: Output<string | undefined>;
	metadata: Output<types.input.meta.v1.ObjectMeta | undefined>;
}
