#!/bin/sh

# Replace env vars in JavaScript files at runtime
if [ ! -z "$REACT_APP_API_URL" ]; then
  echo "Injecting REACT_APP_API_URL: $REACT_APP_API_URL"
  find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$REACT_APP_API_URL|g" {} \;
fi

# Start nginx
exec nginx -g 'daemon off;'
