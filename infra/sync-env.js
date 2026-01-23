const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envFilePath = path.join(__dirname, '../.env.local');

try {
  console.log('Fetching Terraform outputs...');
  const outputJson = execSync('terraform output -json', { cwd: __dirname }).toString();
  const outputs = JSON.parse(outputJson);

  const envContent = [
    `NEXT_PUBLIC_FIREBASE_API_KEY=${outputs.firebase_api_key?.value || ''}`,
    `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${outputs.firebase_auth_domain?.value || ''}`,
    `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${outputs.firebase_project_id?.value || ''}`,
    `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${outputs.firebase_storage_bucket?.value || ''}`,
    `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${outputs.firebase_messaging_sender_id?.value || ''}`,
    `NEXT_PUBLIC_FIREBASE_APP_ID=${outputs.firebase_app_id?.value || ''}`,
  ].join('\n');

  fs.writeFileSync(envFilePath, envContent);
  console.log(`Successfully updated ${envFilePath}`);
} catch (error) {
  console.error('Error syncing environment variables:', error.message);
  process.exit(1);
}
