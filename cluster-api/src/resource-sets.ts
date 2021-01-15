import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

interface Secret {
	key: string;
	value: string;
}

export const createSecretResourceSet = (
	provider: kubernetes.Provider,
	name: string,
	namespace: string,
	secrets: Secret[]
) =>
	new kubernetes.core.v1.Secret(
		name,
		{
			metadata: {
				name,
			},
			type: "addons.cluster.x-k8s.io/resource-set",
			stringData: {
				yaml: `---
apiVersion: v1
kind: Secret
metadata:
  name: ${name}
  namespace: ${namespace}
type: Opaque
data:
  ${encodeSecrets(secrets).join("\n  ")}
`,
			},
		},
		{
			provider,
		}
	);

const encodeSecrets = (secrets: Secret[]): string[] => {
	return secrets.map((secret) => `${secret.key}: ${secret.value}`);
};
