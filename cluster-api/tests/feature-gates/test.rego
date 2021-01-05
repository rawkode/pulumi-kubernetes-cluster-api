package main

deny[msg] {
  input.kind == "Deployment"

  some i, j
  arg := input.spec.template.spec.containers[i].args[j]
  contains(arg, "${EXP_")

  not contains(arg, "MachinePool=false")
  not contains(arg, "ClusterResourceSet=true")

  msg := sprintf("Uninterpolated feature flag in container args: %v", [arg])
}
