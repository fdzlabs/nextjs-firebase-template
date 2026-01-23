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

resource "google_project" "default" {
  provider        = google-beta.no_override
  project_id      = var.project_id
  name            = var.project_name
  billing_account = var.billing_account
  org_id          = var.org_id != "" ? var.org_id : null
}

# Enables required APIs
resource "google_project_service" "firebase" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "firebase.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.service_usage]
}

resource "google_project_service" "service_usage" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "serviceusage.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudresourcemanager" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.service_usage]
}

# Enable Firebase logic
# Using no_override to ensure we can enable Firebase even if billing/quota isn't fully propagated for the new project context yet
resource "google_firebase_project" "default" {
  provider = google-beta.no_override
  project  = google_project.default.project_id

  depends_on = [
    google_project_service.firebase,
    google_project_service.service_usage,
    google_project_service.cloudresourcemanager,
  ]
}

# Create a Firebase Web App
resource "google_firebase_web_app" "default" {
  provider        = google-beta
  project         = google_project.default.project_id
  display_name    = var.project_name
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.default]
}

# Access the Web App config (API Keys, etc.)
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.default.app_id
  project    = google_project.default.project_id
}

# Enable Authentication
resource "google_project_service" "auth" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.service_usage]
}

# This resource requires the target project to be the quota project (user_project_override = true)
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  sign_in {
    email {
      enabled           = true
      password_required = true
    }
    anonymous {
      enabled = false
    }
  }

  authorized_domains = distinct(concat([
    "${var.project_id}.firebaseapp.com",
    "${var.project_id}.web.app",
  ], var.authorized_domains))

  depends_on = [google_project_service.auth]
}

resource "google_identity_platform_default_supported_idp_config" "google" {
  provider      = google-beta
  project       = google_project.default.project_id
  enabled       = true
  idp_id        = "google.com"
  client_id     = var.google_client_id
  client_secret = var.google_client_secret

  count = var.google_client_id != "" ? 1 : 0

  depends_on = [google_identity_platform_config.default]
}


# Enable Firestore
resource "google_project_service" "firestore" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.service_usage]
}

resource "google_firestore_database" "default" {
  provider                    = google-beta
  project                     = google_project.default.project_id
  name                        = "(default)" # Required for default database
  location_id                 = var.firestore_location
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"

  depends_on = [google_project_service.firestore]
}

# Enable Storage
resource "google_project_service" "storage" {
  provider           = google-beta.no_override
  project            = google_project.default.project_id
  service            = "firebasestorage.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.service_usage]
}

resource "google_storage_bucket" "default" {
  provider                    = google-beta.no_override
  project                     = google_project.default.project_id
  name                        = "${google_project.default.project_id}-bucket"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = true

  depends_on = [google_project_service.storage]
}

resource "google_firebase_storage_bucket" "default" {
  provider  = google-beta
  project   = google_project.default.project_id
  bucket_id = google_storage_bucket.default.name

  depends_on = [
    google_firebase_project.default
  ]
}
