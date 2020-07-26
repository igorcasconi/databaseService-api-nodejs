module.exports = (sequelize, DataTypes) => {
    const Caixa_Saldo = sequelize.define('Caixa_Saldo', {
      Caixa_Saldo_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      Caixa_Saldo_value: DataTypes.DOUBLE ,
      Caixa_Saldo_userFirebase: DataTypes.STRING,
      Caixa_Saldo_slideInitial: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  
    return Caixa_Saldo;
  }