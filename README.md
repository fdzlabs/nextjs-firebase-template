# Next.js + Firebase + Terraform Template

[![Built by FDZ Labs](https://img.shields.io/badge/Built%20by-FDZ%20Labs-000000)](https://fdzlabs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust, production-ready template for shipping web applications fast. This starter kit combines the power of **Next.js (App Router)** for the frontend, **Firebase** for backend services (Auth & Firestore), and **Terraform** for reproducible infrastructure.

> **Note:** This is a template repository. Click the green **"Use this template"** button above to start a new project with this codebase.

## 🚀 Features

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
* **Authentication:** Firebase Auth (Email/Password, Google) pre-configured
* **Database:** Firestore with security rules
* **Infrastructure:** Fully automated resource provisioning via [Terraform](https://www.terraform.io/)
* **Type Safety:** TypeScript
* **Package Manager:** pnpm

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+)
* [pnpm](https://pnpm.io/installation)
* [Firebase CLI](https://firebase.google.com/docs/cli)
* [Terraform](https://developer.hashicorp.com/terraform/downloads) (optional, if you want to use the automated infra setup)

## 🏁 Getting Started

### 1. Create your repository
Click the **[Use this template](https://github.com/new?template_name=nextjs-firebase-template&template_owner=fdzlabs)** button at the top of this page to create your own repository.

### 2. Clone and Install
```bash
git clone https://github.com/your-username/your-new-project.git
cd your-new-project
pnpm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in your Firebase configuration values in `.env.local`. You can find these in your Firebase Console under Project Settings.

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## ☁️ Infrastructure & Setup

This template offers two ways to set up your Firebase project:

### Option A: Automated (Recommended)
Use Terraform to automatically provision your Firebase project, enable APIs, and configure authentication.
👉 **[Read the Automated Setup Guide](docs/setup-automated.md)**

### Option B: Manual
Prefer to click through the Firebase Console? We have a checklist for that.
👉 **[Read the Manual Setup Guide](docs/setup-manual.md)**

## 📂 Project Structure

```
├── docs/               # Setup guides and documentation
├── infra/              # Terraform infrastructure code
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components (shadcn/ui)
│   ├── lib/            # Firebase config & utilities
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Show some ❤️  by giving the star to this repo :)

---
*Created by [Alexander Fernandez](https://github.com/your-github-username) at [FDZ Labs](https://fdzlabs.com).*