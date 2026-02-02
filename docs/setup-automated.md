# Automated Setup (Terraform)

This guide explains how to set up the Firebase infrastructure using Terraform. This method is recommended for teams or projects that require reproducible infrastructure.

> [!WARNING]
> **Billing Required**: Terraform automation for Firebase often requires the Google Cloud Project to be on the **Blaze (Pay-as-you-go)** plan to enable certain APIs programmatically. If you wish to stay on the free tier entirely, please see [Manual Setup](./setup-manual.md).

## Prerequisites

1.  **Google Cloud Platform Account**: You need a [Google Cloud account](https://console.cloud.google.com/).
2.  **Terraform**: [Install Terraform](https://developer.hashicorp.com/terraform/install) on your machine.
3.  **gcloud CLI**: [Install the Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

## Steps

### 1. Authenticate

Login to your Google Cloud account via the CLI:

```bash
gcloud auth application-default login
```


This command generates **Application Default Credentials (ADC)**, which allows Terraform to authenticate with Google Cloud using your local user credentials to create resources.

> **Note**: `application-default` is a specific command group in `gcloud`, not a project name or placeholder. You must type it exactly as shown.

#### Alternative: Service Account Key
If you prefer not to install the `gcloud` CLI, you can use a Service Account:
1.  Go to **IAM & Admin** > **Service Accounts** in the Google Cloud Console.
2.  Create a Service Account with **Editor** role (or specific Firebase Admin roles).
3.  Create a **JSON Key** for that account and download it.
4.  Set the environment variable to point to the key file:
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
    ```


### 2. Initialize Terraform

Navigate to the `infra` directory and initialize Terraform:

```bash
cd infra
terraform init
```

### 3. Configure Variables

Create a `terraform.tfvars` file in the `infra` directory to specify your project configuration. You can copy the structure from `variables.tf` or pass them via command line.

**Example `terraform.tfvars`**:
```hcl
project_id      = "my-unique-id-12345"      # MUST be globally unique. Add random numbers to ensure uniqueness.
project_name    = "My Firebase Project"     # Display name (can be anything)
region          = "us-central1"
billing_account = "000000-000000-000000"    # Required for automated project creation
```
```
> **Important**: `project_id` must be:
> 1.  **Globally unique** across all Google Cloud customers.
> 2.  **At most 30 characters long**.
> We recommend appending random numbers (e.g., `my-app-9876`) but keeping it short.

> **Note on Environments**: If you plan to use multiple stages (dev/prod), we recommend creating separate variable files (e.g., `dev.tfvars`, `prod.tfvars`) instead of a single `terraform.tfvars`. See [Managing Stages](./stages.md).

> See [Google Cloud Locations](https://cloud.google.com/about/locations) for a list of available regions.
> You can find your Billing Account ID in the [Google Cloud Billing Console](https://console.cloud.google.com/billing).


### Optional: Google Sign-In

To enable Google Sign-In, you need to provide OAuth credentials.

1.  Go to [**APIs & Services > Credentials**](https://console.cloud.google.com/apis/credentials) in the Google Cloud Console.
2.  Create an **OAuth 2.0 Client ID** for a "Web application".
3.  Add `https://<YOUR-PROJECT-ID>.firebaseapp.com/__/auth/handler` to "Authorized redirect URIs".
4.  Add the credentials to your `terraform.tfvars`:

```hcl
google_client_id     = "YOUR_CLIENT_ID"
google_client_secret = "YOUR_CLIENT_SECRET"
```

If these are omitted, Google Sign-In will simply be disabled.


### Optional: Vercel Deployment

You can optionally provision a Vercel project for your frontend directly via Terraform.

1.  **Prerequisites (Git Integration)**:
    *   **Install App**: You MUST install the [Official Vercel GitHub App](https://github.com/marketplace/vercel) for Terraform to automatically link your repo.
    *   **Permissions**: Ensure the helper script is executable: `chmod +x infra/get_git_repo.sh`.
    *   *See [Vercel Integration Guide](./vercel-integration.md) for full details.*

2.  **Get a Vercel API Token**:
    *   Go to [Vercel Account Tokens](https://vercel.com/account/tokens).
    *   Create a new token with appropriate scope (e.g. "Full Access" or specific to your needs).
2.  **Configure `terraform.tfvars`**:
    *   Set `deploy_vercel = true` (default).
    *   Set `vercel_api_token` to your token.
    *   (Optional) Set `vercel_org_id` if deploying to a Vercel Team.

```hcl
deploy_vercel    = true
vercel_api_token = "your-vercel-api-token"
```

If you do **not** want to deploy to Vercel, set `deploy_vercel = false` in your `terraform.tfvars`.

### Optional: Authorized Domains


To allow authentication from custom domains (e.g. `auth.example.com`), add them to `terraform.tfvars`:

```hcl
authorized_domains = [
  "auth.example.com",
  "app.example.com"
]
```


### 4. Deploy Infrastructure

Run the following command to preview the changes:

```bash
terraform plan
```

If the plan looks correct, apply the changes:

```bash
terraform apply
```

Type `yes` when prompted to confirm.

### 5. Sync Environment Variables

Terraform must be applied at least once for your current workspace (and `-var-file` if used) before syncing. From the **repository root** (not inside `infra`), run:

```bash
pnpm sync-env
```

This reads Terraform outputs and creates or updates `.env.local` with your Firebase configuration keys. Alternatively, you can run `node infra/sync-env.cjs` from the repo root.

## Troubleshooting

### Error 409: Requested entity already exists
**Cause**: The `project_id` you specified is already taken by another Google Cloud user.
**Fix**: Update `project_id` in `terraform.tfvars` to something globally unique (e.g., add random numbers to the end: `my-project-9876`).

### Error 400: Precondition check failed / Billing account issues
**Cause**: The `billing_account` ID is incorrect, or your user does not have permission to link it to a new project.
**Fix**: 
1. Verify the ID in the [Google Cloud Billing Console](https://console.cloud.google.com/billing).
2. Ensure your user has the `Billing Account User` role.

### Permissions Errors (Error 403)
**Cause**: Your local credentials might have expired or lack permissions.
**Fix**: Run `gcloud auth application-default login` again to refresh credentials.

### Error 403: Service Usage API has not been used (Race Condition)
**Cause**: Terraform attempted to enable a service (like Firebase or Firestore) before the main **Service Usage API** was fully enabled for the new project.
**Fix**:
1.  **Retry**: Simply run `terraform apply` again. The Service Usage API usually becomes active within a few seconds, so a second attempt will succeed.
2.  **Dependencies**: The Terraform configuration includes explicit `depends_on` blocks to prevent this, but if you still see it, a retry is the solution.

