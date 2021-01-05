import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import { init, FeatureGate } from "../../src/index";

const provider = new kubernetes.Provider("kubernetes", {
	renderYamlToDirectory: "rendered-yaml",
});

const manifests = init({
	installCertManager: false,
	enableFeatureGates: [FeatureGate.MachinePool],
	kubernetesProvider: provider,
});
