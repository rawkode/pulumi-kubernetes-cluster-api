import { Runtime } from "@rawkode/pulumi-kubernetes-cluster-api/runtimes";
export * from "./ubuntu";

export abstract class Image {
	readonly kubernetesVersion: string;
	readonly runtime: Runtime;

	constructor(kubernetesVersion: string, runtime: Runtime) {
		this.kubernetesVersion = kubernetesVersion;
		this.runtime = runtime;
	}

	abstract id(): string;
	abstract name(): string;
	abstract version(): string;
	abstract preKubeadmCommands(): string[];
	abstract postKubeadmCommands(): string[];
	abstract runtimeCommands(): string[];
}
