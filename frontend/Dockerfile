# Simple production stage - use pre-built files
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway uses dynamic PORT, default to 80
ENV PORT=80

# Start nginx with envsubst for dynamic PORT
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
