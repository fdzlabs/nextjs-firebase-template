# Next.js + Firebase + Terraform Template

[![Built by FDZ Labs](https://img.shields.io/badge/Built%20by-FDZ%20Labs-000000)](https://fdzlabs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready template for shipping web apps quickly. It pairs **Next.js (App Router)** with **Firebase** (Auth, Firestore, Storage) and uses **Terraform** to provision infrastructure. You can run everything locally after syncing env from Terraform outputs, or deploy to **Vercel** with optional Terraform-managed project linking.

> **Note:** This is a template repository. Click the green **"Use this template"** button above to create your own project from this codebase.

## Overview

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), TypeScript.
- **Backend:** Firebase Auth (Email/Password, optional Google), Firestore, Storage.
- **Infrastructure:** Terraform in `infra/` provisions the Firebase project and optional Vercel project; a sync script writes Terraform outputs into `.env.local` so the app runs without manual key copying.
- **Environments:** Optional dev/staging/prod via Terraform workspaces—see [Managing Stages](docs/stages.md).

## Prerequisites

**Common (all setups)**

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/installation)

**Terraform path (recommended)**

- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for `gcloud auth application-default login`) or a [service account key](docs/setup-automated.md#alternative-service-account-key)
- A [Google Cloud Billing Account](https://console.cloud.google.com/billing) (Blaze plan required for automated project/API setup)

**Optional (only if using Terraform to provision Vercel)**

- [Vercel GitHub App](https://github.com/marketplace/vercel) installed for the repo
- `chmod +x infra/get_git_repo.sh`

**Manual path (no Terraform)**

- Access to the [Firebase Console](https://console.firebase.google.com/). Firebase CLI is only needed if you use it for deploy or emulators; the template runs with keys in `.env.local`.

## Getting Started (Terraform – recommended)

### 1. Create your repository

Use the **[Use this template](https://github.com/new?template_name=nextjs-firebase-template&template_owner=fdzlabs)** button, then clone and install:

```bash
git clone https://github.com/your-username/your-new-project.git
cd your-new-project
pnpm install
```

### 2. Authenticate with Google Cloud

Terraform uses Application Default Credentials:

```bash
gcloud auth application-default login
```

### 3. Initialize and configure Terraform

```bash
cd infra
terraform init
```

Copy the example variables file and edit with your values (see [infra/terraform.tfvars.example](infra/terraform.tfvars.example)):

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: project_id, billing_account, etc.
```

You need at least `project_id` (globally unique), `project_name`, `region`, and `billing_account`. For multiple environments, use workspaces and `-var-file`—see [Managing Stages](docs/stages.md).

### 4. Deploy infrastructure

```bash
terraform plan
terraform apply
```

Type `yes` when prompted.

### 5. Sync environment variables

From the **repository root** (not inside `infra`), run:

```bash
pnpm sync-env
```

This reads Terraform outputs and writes `.env.local` with the Firebase config. You must have applied Terraform at least once for the current workspace before this step.

### 6. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Alternative: Manual setup (Spark / free tier)

If you prefer not to use Terraform or billing:

1. Create a project and web app in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Authentication (Email/Password), Firestore, and Storage.
3. Create `.env.local` in the repo root with your Firebase config keys.

Full steps and the exact env vars are in the [Manual Setup Guide](docs/setup-manual.md).

## Infrastructure and deployment

- **Automated (Terraform):** [Automated Setup Guide](docs/setup-automated.md)—auth, variables, optional Google Sign-In and Vercel.
- **Manual (Console):** [Manual Setup Guide](docs/setup-manual.md).
- **Vercel + Git:** [Vercel Integration](docs/vercel-integration.md).
- **Multiple environments:** [Managing Stages](docs/stages.md).

## Project structure

```
├── docs/               # Setup guides and documentation
├── infra/              # Terraform (Firebase, optional Vercel)
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components (shadcn/ui)
│   ├── lib/            # Firebase config & utilities
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── ...config files
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for our code of conduct and how to submit pull requests.

## License

This project is licensed under the MIT License—see [LICENSE](LICENSE).

---
*Created by [Alexander Fernandez](https://github.com/your-github-username) at [FDZ Labs](https://fdzlabs.com).*
