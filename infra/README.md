# Infrastructure — Amazon EKS

## Architecture

```
AWS (us-east-1)
├── VPC (10.0.0.0/16)
│   ├── Public Subnets (2 AZs) → NAT Gateway, Load Balancer
│   └── Private Subnets (2 AZs) → EKS Worker Nodes
├── EKS Cluster (v1.31)
│   ├── Node Group: on-demand (1x t3.small)
│   └── Node Group: spot (1x t3.small)
└── NGINX Ingress Controller (NLB)
```

## Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| EKS Control Plane | $73 |
| 1x t3.small On-Demand | $15 |
| 1x t3.small Spot | ~$3 |
| NAT Gateway | ~$4 |
| NLB | ~$3 |
| **Total** | **~$98** |

## Prerequisites

- AWS CLI configured
- Terraform >= 1.5.0
- kubectl
- helm

## Usage

```bash
cd infra
terraform init
terraform plan
terraform apply
```

## Connect kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name pricing-cluster
```

## Destroy

```bash
terraform destroy
```
