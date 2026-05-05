# Kubernetes Deployment

Aquí se encuentran los manifiestos que definen cómo corre la aplicación en el cluster EKS.

El despliegue es completamente automático: cada push a `main` dispara el pipeline de CI/CD correspondiente (backend o frontend), que después de pasar las validaciones de calidad, construye la imagen Docker, la sube a ECR y actualiza el cluster.

## Estructura

```
deploy/
├── namespace.yaml
├── backend-deployment.yaml
├── frontend-configmap.yaml
├── frontend-deployment.yaml
└── ingress.yaml
```

## Deploy manual (si es necesario)

```bash
aws eks update-kubeconfig --region us-east-1 --name pricing-cluster
kubectl apply -f deploy/
```

## Verificar estado

```bash
kubectl get pods -n pricing
kubectl get ingress -n pricing
```

## Escalar

```bash
kubectl scale deployment backend -n pricing --replicas=3
kubectl scale deployment frontend -n pricing --replicas=3
```
