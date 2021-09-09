import knex from "knex";

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    connectTimeout: 60000,
    pool: {
      min: 1,
      max: 20,
      acquireTimeout: 60 * 1000,
      propagateCreateError: false,
    },
  },
});

export default db;
