module.exports = {
  HOST: process.env.DATABASE_URL,
  PORT: process.env.DATABASE_PORT,
  USER: process.env.DATABASE_USER,
  PASSWORD: process.env.DATABASE_PASS,
  DB: process.env.DATABASE_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
