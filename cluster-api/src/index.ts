import * as kubernetes from "@pulumi/kubernetes";

const VERSION = "0.3.11";

export { create as createCluster } from "./cluster";

export interface ClusterApiManifests {
	certManager?: kubernetes.yaml.ConfigFile;

	clusterApi: kubernetes.yaml.ConfigFile;
}

export interface ClusterApiConfig {
	certManagerVersion?: string;
	enableFeatureGates?: FeatureGate[];
	kubernetesProvider?: kubernetes.Provider;

	installCertManager: Boolean;
}

export enum FeatureGate {
	ClusterResourceSet,
	MachinePool,
}

const isFeatureGateEnabled = (
	featureGate: FeatureGate,
	featureGates: FeatureGate[] = []
) => String(featureGates.includes(featureGate));

export const init = (config: ClusterApiConfig): ClusterApiManifests => {
	const certManager: undefined | kubernetes.yaml.ConfigFile = certManagerInit(
		config
	);

	const clusterApi = new kubernetes.yaml.ConfigFile(
		"cluster",
		{
			file: `https://github.com/kubernetes-sigs/cluster-api/releases/download/v${VERSION}/cluster-api-components.yaml`,
			transformations: [
				(obj: any) => {
					if (obj.kind === "Deployment") {
						obj.spec.template.spec.containers = obj.spec.template.spec.containers.map(
							(c: kubernetes.types.output.core.v1.Container) => {
								return c.args.map((a) => {
									return a
										.replace(
											"${EXP_MACHINE_POOL:=false}",
											isFeatureGateEnabled(
												FeatureGate.MachinePool,
												config.enableFeatureGates
											)
										)
										.replace(
											"${EXP_CLUSTER_RESOURCE_SET:=false}",
											isFeatureGateEnabled(
												FeatureGate.ClusterResourceSet,
												config.enableFeatureGates
											)
										);
								});
							}
						);
					}
				},
			],
		},
		{
			provider: config.kubernetesProvider,
			dependsOn: certManager === undefined ? [] : [certManager],
		}
	);

	return {
		certManager,
		clusterApi,
	};
};

const certManagerInit = (
	config: ClusterApiConfig
): undefined | kubernetes.yaml.ConfigFile | never => {
	if (false === config.installCertManager) {
		return undefined;
	}

	if (undefined === config.certManagerVersion) {
		throw new Error("CertManager install requested, but no version provided.");
	}

	return new kubernetes.yaml.ConfigFile(
		"cert-manager",
		{
			file: `https://github.com/jetstack/cert-manager/releases/download/v${config.certManagerVersion}/cert-manager.yaml`,
		},
		{
			provider: config.kubernetesProvider,
		}
	);
};
