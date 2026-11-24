import "dotenv/config";
import { defineConfig } from "prisma/config";

const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";
const database = process.env.DB_NAME || "runhub";

const encodedPassword = encodeURIComponent(password);
const authPart = password ? `${user}:${encodedPassword}@` : `${user}@`;
const connectionUrl = `mysql://${authPart}${host}:${port}/${database}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: connectionUrl,
  },
});
