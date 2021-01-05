import { Runtime } from "../runtimes";
export * from "./ubuntu";

export abstract class OperatingSystem {
  readonly kubernetesVersion: string;
  readonly runtime: Runtime;

  constructor(kubernetesVersion: string, runtime: Runtime) {
    this.kubernetesVersion = kubernetesVersion;
    this.runtime = runtime;
  }

  abstract name(): string;
  abstract version(): string;
  abstract preKubeadmCommands(): string[];
  abstract postKubeadmCommands(): string[];
  abstract runtimeCommands(): string[];
}
