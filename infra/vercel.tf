data "external" "git_repo" {
  program = ["bash", "${path.module}/get_git_repo.sh"]
}

locals {
  # Map workspaces to Vercel Environment Targets
  # Prod/Default -> Production
  # Others (Dev, Staging) -> Preview & Development (Localhost)
  vercel_targets = (terraform.workspace == "default" || terraform.workspace == "prod") ? ["production"] : ["preview", "development"]

  # Only create the project if we are in the "owner" workspace (default or prod)
  should_create_project = (terraform.workspace == "default" || terraform.workspace == "prod")
}

resource "vercel_project" "default" {
  count     = local.should_create_project ? 1 : 0
  name      = var.vercel_project_name != "" ? var.vercel_project_name : replace(lower(var.project_name), " ", "-")
  framework = "nextjs"
  team_id   = var.vercel_org_id != "" ? var.vercel_org_id : null

  git_repository = {
    type = coalesce(var.vercel_git_type, data.external.git_repo.result["type"], "github")
    repo = coalesce(var.vercel_git_repo, data.external.git_repo.result["repo"])
  }

  # Ignore builds if "[skip ci]" or "[skip vercel]" is in the commit message,
  # or if only markdown files or docs/ folder changed.
  ignore_command = "git log -1 --pretty=%B | grep -qE '\\[skip ci\\]|\\[skip vercel\\]' && exit 0 || git diff --quiet HEAD^ HEAD . ':(exclude)**/*.md' ':(exclude)docs/'"
}

# If we are NOT the owner workspace, look up the existing project so we can modify its env vars
data "vercel_project" "existing" {
  count   = local.should_create_project ? 0 : 1
  name    = var.vercel_project_name != "" ? var.vercel_project_name : replace(lower(var.project_name), " ", "-")
  team_id = var.vercel_org_id != "" ? var.vercel_org_id : null
}

locals {
  # Get the Project ID from either the resource we created OR the data source lookup
  # logical OR isn't available for resources, so using splat syntax and coalesce
  project_id = local.should_create_project ? vercel_project.default[0].id : data.vercel_project.existing[0].id
}

# --- Environment Variables ---

resource "vercel_project_environment_variable" "firebase_api_key" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_API_KEY"
  value      = data.google_firebase_web_app_config.default.api_key
  target     = local.vercel_targets
}

resource "vercel_project_environment_variable" "firebase_auth_domain" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  value      = data.google_firebase_web_app_config.default.auth_domain
  target     = local.vercel_targets
}

resource "vercel_project_environment_variable" "firebase_project_id" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  value      = var.project_id
  target     = local.vercel_targets
}

resource "vercel_project_environment_variable" "firebase_storage_bucket" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  value      = lookup(data.google_firebase_web_app_config.default, "storage_bucket", "")
  target     = local.vercel_targets
}

resource "vercel_project_environment_variable" "firebase_messaging_sender_id" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  value      = data.google_firebase_web_app_config.default.messaging_sender_id
  target     = local.vercel_targets
}

resource "vercel_project_environment_variable" "firebase_app_id" {
  project_id = local.project_id
  team_id    = var.vercel_org_id != "" ? var.vercel_org_id : null
  key        = "NEXT_PUBLIC_FIREBASE_APP_ID"
  value      = google_firebase_web_app.default.app_id
  target     = local.vercel_targets
}
