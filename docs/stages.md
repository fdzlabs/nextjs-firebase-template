# Managing Infrastructure Stages

This project uses **Terraform Workspaces** to manage multiple environments (e.g., `dev`, `stage`, `prod`) from a single set of configuration files.

Each workspace maintains its own state file, effectively isolating the infrastructure for that environment.

## How it Works

*   **Workspaces:** Each environment corresponds to a Terraform Workspace (e.g., `dev`, `prod`).
*   **Variable Files:** Each environment has its own `.tfvars` file (e.g., `dev.tfvars`, `prod.tfvars`) containing environment-specific values like Project ID and OAuth secrets.

## Default Behavior

By default, the project starts with a **single stage** (the `default` workspace).
- If you follow the [Automated Setup](./setup-automated.md), you are deploying to this `default` stage.
- **Think of this as your "Production" environment.** It is the only one that exists until you create more.
- You only need to add more stages (like `dev` or `staging`) when you are ready for environment isolation.

## Operations

### 1. View Current Stage
To see which environment you are currently targeting:

```bash
cd infra
terraform workspace show
```

To list all available stages:

```bash
terraform workspace list
```

### 2. Switch Stages
To switch from one environment to another (e.g., from `dev` to `prod`):

```bash
terraform workspace select prod
```

### 3. Apply Changes to a Stage
When applying changes, you **must** provide the variable file matching your current workspace.

**Example for `dev`:**
```bash
terraform workspace select dev
terraform apply -var-file="dev.tfvars"
```

**Example for `prod`:**
```bash
terraform workspace select prod
terraform apply -var-file="prod.tfvars"
```

---

## How to Create a New Stage

Follow these steps to spin up a completely new environment (e.g., `staging`).

1.  **Create the Workspace:**
    ```bash
    cd infra
    terraform workspace new staging
    ```
    *This creates a new, empty state file for `staging` and automatically switches you to it.*

2.  **Create the Variable File:**
    Create a file named `infra/staging.tfvars`. You can copy `terraform.tfvars.example` as a base.
    ```hcl
    project_id = "my-app-staging"
    # ... set other variables specific to this stage ...
    ```

3.  **Deploy:**
    Run a plan to preview changes:
    ```bash
    terraform plan -var-file="staging.tfvars"
    ```

    Then apply the changes:
    ```bash
    terraform apply -var-file="staging.tfvars"
    ```
    *This will provision a fresh GCP project, Firebase app, etc.*

---

## Impact on Components

Each stage creates isolated infrastructure. Here is what happens when you create a new stage:

### 1. Google Cloud Platform (GCP) & Firebase
**Strategy:** Each details stage (workspace) creates a *completely separate* GCP Project.

*   **Project Isolation:**
    *   **Prod:** `my-app-prod` (Project ID)
    *   **Dev:** `my-app-dev` (Project ID)
    *   **Impact:** A developer accidentally deleting a database in `dev` has **zero risk** of affecting `prod`. Quotas are also isolated (e.g., heavily testing a function in dev won't exhaust your production email quota).

*   **Authentication (Firebase Auth):**
    *   **Users:** Users created in `prod` do not exist in `dev`. You can test user flows (signup, password reset) in `dev` using dummy emails without polluting your real user base.
    *   **SSO/Oauth:** You will need separate Client IDs (Google, GitHub, etc.) for each environment. Your `dev.tfvars` will have the "Dev App" credentials, and `prod.tfvars` will have the live ones.

*   **Firestore & Storage:**
    *   **Data:** Data is completely empty when you first spawn the `dev` environment. This allows you to perform destructive tests (e.g., "delete all users") safely.
    *   **Security Rules:** You can deploy stricter rules to `prod` while keeping looser rules in `dev` for debugging, if needed (though keeping them synced is best practice).

### 2. Vercel
**Strategy:** Vercel natively supports environments (`Production`, `Preview`, `Development`). Our Terraform setup maps these.

*   **Project Structure:**
    *   Usually, you keep **one** Vercel Project (e.g., `my-app-web`) connected to your Git repository.
    *   Vercel automatically deploys based on the branch:
        *   `main` branch → **Production** Environment
        *   `develop` / PRs → **Preview** Environment

*   **Environment Variables (The Critical Link):**
    *   Terraform injects the *correct* Firebase config into Vercel's environment variables.
    *   **Scenario:**
        *   When you run `terraform apply` for your **Prod** workspace: Terraform updates Vercel's **Production** Environment variables with the `my-app-prod` Firebase keys.
        *   When you run `terraform apply` for your **Dev** workspace: Terraform updates Vercel's **Preview** (or Development) Environment variables with the `my-app-dev` Firebase keys.
    *   **Result:** A Pull Request build on Vercel automatically talks to your **Dev/Preview** Firebase project, not Production.

### 3. CI/CD (GitHub Actions) - Future Integration
**Strategy:** *When you are ready to automate deployments*, your pipeline will need to know which stage to target.

*   **Workflow per Branch:**
    *   `on: push to main`: Runs `terraform workspace select prod && terraform apply`.
    *   `on: pull_request`: Runs `terraform workspace select dev && terraform apply`.
