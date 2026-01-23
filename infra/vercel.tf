resource "vercel_project" "default" {
  count     = var.deploy_vercel ? 1 : 0
  name      = var.vercel_project_name != "" ? var.vercel_project_name : replace(lower(var.project_name), " ", "-")
  framework = "nextjs"
  team_id   = var.vercel_org_id != "" ? var.vercel_org_id : null

  environment = [
    {
      key    = "NEXT_PUBLIC_FIREBASE_API_KEY"
      value  = data.google_firebase_web_app_config.default.api_key
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
      value  = data.google_firebase_web_app_config.default.auth_domain
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
      value  = var.project_id
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
      value  = lookup(data.google_firebase_web_app_config.default, "storage_bucket", "")
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
      value  = data.google_firebase_web_app_config.default.messaging_sender_id
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_FIREBASE_APP_ID"
      value  = google_firebase_web_app.default.app_id
      target = ["production", "preview", "development"]
    }
  ]
}
