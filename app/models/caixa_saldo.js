module.exports = (sequelize, DataTypes) => {
    const Caixa_Saldo = sequelize.define('Caixa_Saldo', {
      Caixa_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      Caixa_Saldo_value: DataTypes.DOUBLE ,
      Caixa_Saldo_userFirebase: DataTypes.STRING,
    });
  
    return Caixa_Saldo;
  }