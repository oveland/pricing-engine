# Infraestructura — Amazon EKS

Toda la infraestructura se gestiona con Terraform y se aplica mediante el workflow de GitHub Actions (`infra.yml`), que permite ejecutar `plan`, `apply` o `destroy` de forma manual desde la pestaña de Actions.

## Arquitectura

```
AWS (us-east-1)
├── VPC (10.0.0.0/16)
│   ├── Public Subnets (2 AZs) → NAT Gateway, Load Balancer
│   └── Private Subnets (2 AZs) → EKS Worker Nodes
├── EKS Cluster (v1.31)
│   ├── Node Group: on-demand (1x t3.small)
│   └── Node Group: spot (1x t3.small)
├── ECR (pricing-engine-backend, pricing-engine-frontend)
└── NGINX Ingress Controller (NLB)
```

## Estimación de costos

| Recurso | Costo mensual |
|---------|--------------|
| EKS Control Plane | $73 |
| 1x t3.small On-Demand | $15 |
| 1x t3.small Spot | ~$3 |
| NAT Gateway | ~$4 |
| NLB | ~$3 |
| ECR | ~$0.04 |
| **Total** | **~$98** |

## Uso local (si es necesario)

```bash
cd infra
terraform init
terraform plan
terraform apply
```

## Conectar kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name pricing-cluster
```

## Destruir

```bash
terraform destroy
```
