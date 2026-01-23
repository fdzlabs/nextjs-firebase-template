variable "project_id" {
  description = "The ID of the Google Cloud Project"
  type        = string
}

variable "project_name" {
  description = "The name of the Google Cloud Project"
  type        = string
  default     = "NextJS Firebase Template"
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
  default     = "us-central1"
}

variable "firestore_location" {
  description = "The location for Firestore database (often needs to be one of the multi-region locations like nam5 for us-central)"
  type        = string
  default     = "nam5"
}

variable "billing_account" {
  description = "The ID of the Billing Account to associate with the project"
  type        = string
}

variable "org_id" {
  description = "The Organization ID (optional)"
  type        = string
  default     = ""
}

variable "google_client_id" {
  description = "The Client ID for Google OAuth (optional, required for Google Sign-In)"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "The Client Secret for Google OAuth (optional, required for Google Sign-In)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "authorized_domains" {
  description = "List of authorized domains for Firebase Authentication"
  type        = list(string)
  default     = []
}
