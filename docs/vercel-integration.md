# Vercel Git Integration Walkthrough

I have updated the infrastructure configuration to automatically detect and connect the Vercel project to your Git repository. This enables Vercel to trigger deployments on code pushes.

## Changes

### 1. Dynamic Git Repository Detection
- Created `infra/get_git_repo.sh`: A script that fetches your git remote URL and parses it to get the repository name (e.g., `fdzlabs/nextjs-firebase-template`) and type (defaulting to `github`).
- Updated `infra/vercel.tf`: Added a `data "external" "git_repo"` block to run this script.

### 2. Vercel Project Configuration
- Updated `infra/vercel.tf`: The `vercel_project` resource now includes a `git_repository` block.
- It prioritizes variables `vercel_git_repo` and `vercel_git_type` if set.
- If not set, it uses the values detected by the script.

### 3. New Variables
- Added `vercel_git_repo` and `vercel_git_type` to `infra/variables.tf` and examples to `infra/terraform.tfvars` and `infra/terraform.tfvars.example`. These are optional and allow you to override the auto-detection if needed.

## Verification Results

### Automated Verification
I ran `terraform validate` and `terraform plan`. The plan confirmed that Terraform correctly detected the repository as `fdzlabs/nextjs-firebase-template`.

```
  ~ resource "vercel_project" "default" {
      + git_repository                                    = {
          + production_branch = (known after apply)
          + repo              = "fdzlabs/nextjs-firebase-template"
          + type              = "github"
        }
```

## Prerequisites

### 1. Install Official Vercel GitHub App
For Terraform to automatically link your repository, you must install the official Vercel app:
1.  Visit the **[Vercel App on GitHub Marketplace](https://github.com/marketplace/vercel)**.
2.  Click **Configure** (or Install).
3.  Select your Vercel account/organization and grant access to the repository.

### 2. Make Helper Script Executable
> [!IMPORTANT]
> You must ensure the helper script is executable.
> ```bash
> chmod +x infra/get_git_repo.sh
> ```

## Troubleshooting

### "Error linking git repo... install the GitHub integration"
If you see this error, please verify you have completed Prerequisite #1 above.

## Next Steps

1.  Run `terraform apply` in the `infra` directory to apply the changes.
    ```bash
    cd infra
    terraform apply
    ```
2.  Check your Vercel dashboard. The project should now be connected to your GitHub repository, and you should see deployments triggered by pushes to your branch.
