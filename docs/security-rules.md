# Firebase Security Rules

Example rules live under `firebase/`:

| File                                                      | Purpose                                     |
| :-------------------------------------------------------- | :------------------------------------------ |
| [`firebase/firestore.rules`](../firebase/firestore.rules) | User-owned `users/{uid}` profile documents  |
| [`firebase/storage.rules`](../firebase/storage.rules)     | User-owned `avatars/{uid}/*` uploads        |
| [`firebase.json`](../firebase.json)                       | Points the Firebase CLI at those rule files |

## Deploy with Firebase CLI

```bash
# From the repo root (requires firebase-tools and a linked project)
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,storage
```

## Deploy from the Console

1. Open [Firebase Console](https://console.firebase.google.com/) → your project.
2. **Firestore** → **Rules** — paste `firebase/firestore.rules`, publish.
3. **Storage** → **Rules** — paste `firebase/storage.rules`, publish.

Replace the default “test mode” rules before shipping to production.
