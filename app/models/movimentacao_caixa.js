module.exports = (sequelize, DataTypes) => {
    const Movimentacao_Caixa = sequelize.define('Movimentacao_Caixa', {
      Movimentacao_Caixa_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      Movimentacao_Caixa_product: DataTypes.STRING,
      Movimentacao_Caixa_value: DataTypes.DOUBLE ,
      Movimentacao_Caixa_date: DataTypes.DATE,
      Movimentacao_Caixa_userFirebase: DataTypes.STRING,
      Movimentacao_Caixa_Tipo_Movimentacao_id: DataTypes.INTEGER,
      Movimentacao_Caixa_Paymode: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  
    return Movimentacao_Caixa;
  }