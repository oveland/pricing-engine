module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  cluster_addons = {
    coredns    = { most_recent = true }
    kube-proxy = { most_recent = true }
    vpc-cni    = { most_recent = true }
  }

  eks_managed_node_groups = {
    on_demand = {
      name           = "on-demand"
      instance_types = [var.node_instance_type]
      capacity_type  = "ON_DEMAND"

      min_size     = 1
      max_size     = 2
      desired_size = 1

      labels = {
        role = "general"
        type = "on-demand"
      }
    }

    spot = {
      name           = "spot"
      instance_types = [var.node_instance_type, "t3.medium"]
      capacity_type  = "SPOT"

      min_size     = 0
      max_size     = 2
      desired_size = 1

      labels = {
        role = "general"
        type = "spot"
      }

      taints = []
    }
  }

  enable_cluster_creator_admin_permissions = true

  tags = {
    Project     = var.project_name
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
