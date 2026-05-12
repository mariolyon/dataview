#!/bin/sh
echo "#DEPLOY"
ROOT=$(git rev-parse --show-toplevel)
kubectl apply -f ${ROOT}/k8s/deployment.yaml
kubectl rollout restart deployment dataview
