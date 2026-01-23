# Manual Setup (Free Tier)

This guide explains how to set up the Firebase infrastructure manually using the Firebase Console. This is the recommended path for hobby projects or prototypes that want to ensure they stay within the **Spark (Free)** plan limits and avoid credit card requirements.

## Steps

### 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Add project**.
3.  Enter a **Project name** (e.g., `my-nextjs-app`).
4.  Disable Google Analytics for simplicity (or enable if you want it).
5.  Click **Create project**.

### 2. Create a Web App

1.  In the Project Overview, click the **Web** icon (`</>`) to add a new app.
2.  Register the app with a nickname (e.g., `NextJS Frontend`).
3.  **Important**: You don't need to set up Firebase Hosting yet if you are just developing locally.
4.  Click **Register app**.
5.  You will see a code block with `firebaseConfig`. **Keep this tab open** or copy the values. You will need them for your `.env.local`.

### 3. Enable Authentication

1.  Go to **Build** > **Authentication** in the sidebar.
2.  Click **Get started**.
3.  Select **Email/Password** as a Sign-in method.
4.  Toggle **Enable**.
5.  Click **Save**.

### 4. Enable Firestore Database

1.  Go to **Build** > **Firestore Database**.
2.  Click **Create database**.
3.  Select a **Location** (e.g., `nam5 (us-central)`).
4.  Choose **Start in test mode** for development (allows read/write for 30 days).
    > [!CAUTION]
    > Remember to update your Security Rules before going to production!
5.  Click **Create**.

### 5. Enable Storage

1.  Go to **Build** > **Storage**.
2.  Click **Get started**.
3.  Select **Start in test mode**.
4.  Click **Next**, then **Done** (using the default bucket location).

### 6. Configure Local Environment

Create a file named `.env.local` in the root of your project and populate it with the values from **Step 2**.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

If you lost the config values, you can find them again in **Project Settings** (Gear icon) > **General** > **Your apps** > **SDK setup and configuration** > **Config**.
