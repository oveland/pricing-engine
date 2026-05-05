terraform {
  backend "s3" {
    bucket         = "pricing-engine-tfstate"
    key            = "infra/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "pricing-engine-tflock"
  }
}
