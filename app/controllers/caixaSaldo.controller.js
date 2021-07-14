import db from "../database/connection";

export default class CaixaSaldoController {
  async create(req, res) {
    const { userFirebase } = req.body;

    if (!userFirebase)
      return res.status(400).send({
        errorMessage: "Náo possui a informação de userFirebase!",
      });

    try {
      await db
        .from("Caixa_Saldo")
        .insert({ Caixa_Saldo_userFirebase: userFirebase });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({
        errorMessage: "Ocorreu um erro ao gravar novo usuário!",
      });
    }
  }
}
