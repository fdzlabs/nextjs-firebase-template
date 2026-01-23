output "firebase_api_key" {
  value     = data.google_firebase_web_app_config.default.api_key
  sensitive = true
}

output "firebase_auth_domain" {
  value = data.google_firebase_web_app_config.default.auth_domain
}

output "firebase_project_id" {
  value = var.project_id
}

output "firebase_storage_bucket" {
  value = lookup(data.google_firebase_web_app_config.default, "storage_bucket", "")
}

output "firebase_messaging_sender_id" {
  value = data.google_firebase_web_app_config.default.messaging_sender_id
}

output "firebase_app_id" {
  value = google_firebase_web_app.default.app_id
}
