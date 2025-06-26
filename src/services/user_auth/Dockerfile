FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD sh -c '\
  npx prisma migrate dev --name init \
  || { \
    echo "Migrations failed. Trying direct SQL import..."; \
    if ! npx prisma db pull > /dev/null 2>&1; then \
      echo "Database does not exist, applying raw migration SQL..."; \
      PGPASSWORD=$POSTGRES_PASSWORD psql -h user_db_auth -U $POSTGRES_USER -d $POSTGRES_DB -f /app/prisma/migrations/20250623112908_init/migration.sql; \
    else \
      echo "Database exists, not importing raw SQL."; \
    fi; \
  }; \
  node index.js'
