export default function FirebaseConfigGuide() {
  return (
    <div className="bg-muted space-y-4 rounded-lg p-4">
      <h3 className="text-lg font-medium">Firebase Configuration Guide</h3>
      <p className="text-muted-foreground text-sm">
        To use this starter, you need to add your Firebase configuration to your
        environment variables.
      </p>
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Add the following to your .env.local file:
        </p>
        <pre className="bg-background overflow-x-auto rounded-md p-2 text-xs">
          <code>{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id`}</code>
        </pre>
      </div>
      <p className="text-muted-foreground text-xs">
        You can find these values in your Firebase project settings.
      </p>
    </div>
  )
}
