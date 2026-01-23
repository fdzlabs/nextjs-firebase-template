terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "google" {
  region = var.region
}

# Provider for Project Creation & API Enablement (uses local credentials/quota)
provider "google-beta" {
  alias                 = "no_override"
  region                = var.region
  user_project_override = false
}

# Provider for Firebase Configuration (uses the new project's quota)
# Required for Identity Platform, etc.
provider "google-beta" {
  region                = var.region
  user_project_override = true
}

provider "vercel" {
  api_token = var.vercel_api_token
}
