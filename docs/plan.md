# Project Plan

This document outlines the plan for creating the Next.js + Firebase Template infrastructure.

## Objectives
1.  **Infrastructure as Code (IaC)**: Use Terraform to manage Firebase resources.
2.  **Template Creation**: Make this repo a reusable template.
3.  **Environment Automation**: Automatically populate frontend environment variables from Terraform outputs.

## Architecture

## Architecture

### Infrastructure (`infra/`)
- **Automated Path (Terraform)**:
    - Provisions Firebase Project, Auth, Firestore, and Storage.
    - **Note**: often requires Billing Account for API enablement.
- **Manual Path (Free Tier/Console)**:
    - Documentation guid on how to set up resources manually in Firebase Console.
    - Instructions on where to find config values.

### Services
- **Authentication**: Setup providers (Email/Password default).
- **Firestore**: Database for user profiles.
- **Storage**: Bucket for assets/images.

### Frontend
- User provides Next.js code later.
- Expectation: Frontend uses standard Firebase environment variables (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).

## Workflow Scenarios

### Scenario A: Automated Setup (Recommended for Teams/Blaze)
1. Clone repo, `pnpm install`.
2. `gcloud auth application-default login`.
3. `cd infra`, `terraform init`, create `terraform.tfvars` (e.g. from `terraform.tfvars.example`).
4. `terraform apply`.
5. From repo root: `pnpm sync-env` (populates `.env.local`).
6. `pnpm dev`.

### Scenario B: Manual Setup (Free Tier)
1. Create project in Firebase Console.
2. Enable Auth, Firestore, Storage manually.
3. Copy config values from Console → Project Settings.
4. Paste into `.env.local`.

