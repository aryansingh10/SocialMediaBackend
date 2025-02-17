import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: "./src/schema",
  out: './drizzle/migrations',
  dbCredentials: {
    host: 'localhost',
    user: 'aryansinghthakur',
    password: '1234',
    database: 'finalProject',
  },
});