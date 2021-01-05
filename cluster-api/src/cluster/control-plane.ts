import * as kubernetes from "@pulumi/kubernetes";

interface Config {
  replicas: Number;
}

const createControlPlane = (config: Config) => {
  return;
};

// const kubeadmControlPlane = new capi.controlplane.v1alpha3.KubeadmControlPlane(
//   `${name}-kubeadm-control-plane`,
//   {
//     spec: {
//       replicas: 3,
//       version: `v${version}`,
//       infrastructureTemplate: {
//         apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha3",
//         kind: "PacketMachineTemplate",
//         name: pulumi.interpolate`${controlPlaneTemplate.metadata.name}`,
//       },
//       kubeadmConfigSpec: {
//         clusterConfiguration: {
//           apiServer: {
//             extraArgs: {
//               "cloud-provider": "external",
//             },
//           },
//           controllerManager: {
//             extraArgs: {
//               "cloud-provider": "external",
//             },
//           },
//         },
//         initConfiguration: {
//           nodeRegistration: {
//             kubeletExtraArgs: {
//               "cloud-provider": "external",
//             },
//           },
//         },
//         joinConfiguration: {
//           nodeRegistration: {
//             kubeletExtraArgs: {
//               "cloud-provider": "external",
//             },
//           },
//         },
//         preKubeadmCommands: [
//           'sed -ri "/sswaps/s/^#?/#/" /etc/fstab',
//           "swapoff -a",
//           "mount -a",
//           "apt update",
//           "DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https curl",
//           "curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -",
//           'echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list',
//           "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
//           "apt-key fingerprint 0EBFCD88",
//           'add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"',
//           "apt update",
//           `TRIMMED_KUBERNETES_VERSION=$(echo ${version} | sed 's/\\./\\\\./g' | sed 's/^v//')`,
//           "RESOLVED_KUBERNETES_VERSION=$(apt-cache policy kubelet | awk -v VERSION=${TRIMMED_KUBERNETES_VERSION} '$1~ VERSION { print $1 }' | head -n1)",
//           "apt-get install -y ca-certificates socat jq ebtables apt-transport-https cloud-utils prips docker-ce docker-ce-cli containerd.io kubelet=${RESOLVED_KUBERNETES_VERSION} kubeadm=${RESOLVED_KUBERNETES_VERSION} kubectl=${RESOLVED_KUBERNETES_VERSION}",
//           "systemctl daemon-reload",
//           "systemctl enable docker",
//           "systemctl start docker",
//           "ping -c 3 -q {{ .controlPlaneEndpoint }} && echo OK || ip addr add {{ .controlPlaneEndpoint }} dev lo",

//           "GRUB_FILE=/etc/default/grub",
//           "GRUB_FILE_MODIFIED=0",

//           `if ! grep -q 'hugepagesz' $GRUB_FILE; then sed -i 's/GRUB_CMDLINE_LINUX="\\(.*\\)"/GRUB_CMDLINE_LINUX="\\1 hugepagesz=2M"/' $GRUB_FILE; GRUB_FILE_MODIFIED=1; fi`,
//           "echo always > /sys/kernel/mm/transparent_hugepage/enabled",

//           'if [ "$GRUB_FILE_MODIFIED" = "1" ]; then grub-mkconfig -o /boot/grub2/grub.cfg; fi',

//           "echo 512 | sudo tee /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages",
//           "echo 'vm.nr_hugepages = 512' >> /etc/sysctl.conf",

//           "modprobe nvme_tcp",
//           'echo "nvme_tcp" >> /etc/modules-load.d/modules.conf',
//         ],
//         postKubeadmCommands: [
//           `cat <<EOF >> /etc/network/interfaces
// auto lo:0
// iface lo:0 inet static
// address {{ .controlPlaneEndpoint }}
// netmask 255.255.255.255
// EOF`,
//           "systemctl restart networking",
//           `kubectl --kubeconfig /etc/kubernetes/admin.conf create secret generic -n kube-system packet-cloud-config --from-literal=cloud-sa.json='{"apiKey": "{{ .apiKey }}","projectID": "${projectID}", "eipTag": "cluster-api-provider-packet:cluster-id:${name}"}'`,
//           "kubectl apply --kubeconfig /etc/kubernetes/admin.conf -f https://github.com/packethost/packet-ccm/releases/download/v1.1.0/deployment.yaml",
//         ],
//       },
//     },
//   },
//   { provider }
// );
