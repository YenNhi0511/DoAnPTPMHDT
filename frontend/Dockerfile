# Simple production stage - use pre-built files
FROM nginx:alpine

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway uses dynamic PORT
ENV PORT=80

# Expose port (Railway will override)
EXPOSE ${PORT}

# Start nginx with envsubst for dynamic PORT
CMD sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
