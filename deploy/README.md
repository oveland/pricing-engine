# Kubernetes Deployment — Pricing Service

## Structure

```
deploy/
├── namespace.yaml
├── backend-deployment.yaml
├── frontend-configmap.yaml
├── frontend-deployment.yaml
└── ingress.yaml
```

## Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or local)
- `kubectl` configured
- Docker images published to a registry
- NGINX Ingress Controller installed

## Deploy

```bash
kubectl apply -f deploy/
```

## Verify

```bash
kubectl get all -n pricing
kubectl get ingress -n pricing
```

## Scale

```bash
kubectl scale deployment backend -n pricing --replicas=3
kubectl scale deployment frontend -n pricing --replicas=3
```
