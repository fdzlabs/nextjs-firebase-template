#!/bin/bash

# Get the remote origin URL
REMOTE_URL=$(git config --get remote.origin.url)

if [ -z "$REMOTE_URL" ]; then
  # If no remote is found, return empty JSON or an error indicator
  # Terraform external data source expects a JSON object
  echo '{"repo": "", "type": ""}'
  exit 0
fi

# Extract repo name
# Supports:
# git@github.com:user/repo.git
# https://github.com/user/repo.git

if [[ "$REMOTE_URL" == *"github.com"* ]]; then
  TYPE="github"
elif [[ "$REMOTE_URL" == *"gitlab.com"* ]]; then
  TYPE="gitlab"
elif [[ "$REMOTE_URL" == *"bitbucket.org"* ]]; then
  TYPE="bitbucket"
else
  TYPE="github" # Default to github or unknown
fi

# Parse repo path
# Remove .git suffix
CLEAN_URL=${REMOTE_URL%.git}

# Remove protocol/domain prefix
if [[ "$CLEAN_URL" == *"@"* ]]; then
  # SSH: git@github.com:user/repo
  REPO=${CLEAN_URL#*:}
else
  # HTTPS: https://github.com/user/repo
  # Remove protocol
  NO_PROTO=${CLEAN_URL#*://}
  # Remove domain (assuming standard github.com/user/repo structure)
  REPO=${NO_PROTO#*/}
fi

# Output JSON
echo "{\"repo\": \"$REPO\", \"type\": \"$TYPE\"}"
