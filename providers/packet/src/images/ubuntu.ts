import { Runtime } from "@rawkode/pulumi-kubernetes-cluster-api/runtimes";
import { Image } from "./index";

abstract class Ubuntu extends Image {
	name(): string {
		return "Ubuntu";
	}

	preKubeadmCommands(): string[] {
		return [
			'sed -ri "/sswaps/s/^#?/#/" /etc/fstab',
			"swapoff -a",
			"mount -a",
			"apt update",
			"DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https curl",
			"curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -",
			'echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list',
			"apt update",
			`TRIMMED_KUBERNETES_VERSION=$(echo ${this.kubernetesVersion} | sed 's/\\./\\\\./g' | sed 's/^v//')`,
			"RESOLVED_KUBERNETES_VERSION=$(apt-cache policy kubelet | awk -v VERSION=${TRIMMED_KUBERNETES_VERSION} '$1~ VERSION { print $1 }' | head -n1)",
			...this.runtimeCommands(),
			"apt-get install -y ca-certificates socat jq ebtables apt-transport-https cloud-utils prips kubelet=${RESOLVED_KUBERNETES_VERSION} kubeadm=${RESOLVED_KUBERNETES_VERSION} kubectl=${RESOLVED_KUBERNETES_VERSION}",

			"ping -c 3 -q {{ .controlPlaneEndpoint }} && echo OK || ip addr add {{ .controlPlaneEndpoint }} dev lo",

			"GRUB_FILE=/etc/default/grub",
			"GRUB_FILE_MODIFIED=0",

			`if ! grep -q 'hugepagesz' $GRUB_FILE; then sed -i 's/GRUB_CMDLINE_LINUX="\\(.*\\)"/GRUB_CMDLINE_LINUX="\\1 hugepagesz=2M"/' $GRUB_FILE; GRUB_FILE_MODIFIED=1; fi`,
			"echo always > /sys/kernel/mm/transparent_hugepage/enabled",

			'if [ "$GRUB_FILE_MODIFIED" = "1" ]; then grub-mkconfig -o /boot/grub2/grub.cfg; fi',

			"echo 512 | sudo tee /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages",
			"echo 'vm.nr_hugepages = 512' >> /etc/sysctl.conf",

			"modprobe nvme_tcp",
			'echo "nvme_tcp" >> /etc/modules-load.d/modules.conf',
		];
	}

	postKubeadmCommands(): string[] {
		return [];
	}

	runtimeCommands(): string[] {
		switch (this.runtime) {
			case Runtime.Docker:
				return [
					"curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
					"apt-key fingerprint 0EBFCD88",
					'add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"',
					"apt update",
					"apt-get install -y docker-ce docker-ce-cli containerd.io",
					"systemctl daemon-reload",
					"systemctl enable docker",
					"systemctl start docker",
				];

			case Runtime.containerd:
				return [
					"apt install -y containerd",
					"systemctl daemon-reload",
					"systemctl enable containerd",
					"systemctl start containerd",
				];

			default:
				return [];
		}
	}
}

export class Ubuntu2004 extends Ubuntu {
	id(): string {
		return "ubuntu_20_04";
	}

	version(): string {
		return "20.04";
	}
}

export class Ubuntu2010 extends Ubuntu {
	id(): string {
		return "ubuntu_20_10";
	}

	version(): string {
		return "20.10";
	}
}
