module.exports = {
    HOST: "mysql669.umbler.com",
    PORT: 41890,
    USER: "casconi_lc",
    PASSWORD: "46Oliveira",
    DB: "livrocaixa_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};