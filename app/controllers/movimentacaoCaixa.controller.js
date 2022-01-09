import { format } from "date-fns";

import db from "../database/connection";
export default class MovimentacaoCaixaController {
  async create(req, res) {
    const { id, type } = req.params;
    const { product, value, paymode, date, time } = req.body;

    const datetime = `${format(new Date(date), "yyyy-MM-dd")}T${time}:00`;

    const mov_caixa = {
      product,
      value,
      paymode,
      date,
      time,
      datetime,
    };

    try {
      await db.from("Movimentacao_Caixas").insert({
        Movimentacao_Caixa_product: mov_caixa.product,
        Movimentacao_Caixa_value: mov_caixa.value,
        Movimentacao_Caixa_date: mov_caixa.datetime,
        Movimentacao_Caixa_userFirebase: id,
        Movimentacao_Caixa_Tipo_Movimentacao_id: type,
        Movimentacao_Caixa_Paymode: mov_caixa.paymode,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      return res.status(500).json({
        errorMessage: "Ocorreu um erro ao processar a criação da movimentação",
      });
    }
  }

  async FinancialMovement(req, res) {
    const { id, type } = req.params;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { id: "Movimentacao_Caixa_id" },
          { product: "Movimentacao_Caixa_product" },
          { value: "Movimentacao_Caixa_value" },
          { payMode: "Movimentacao_Caixa_Paymode" },
          {
            date: db.raw(
              "DATE_FORMAT(Movimentacao_Caixa_date, '%d/%m/%Y %H:%i')"
            ),
          }
        )
        .where({
          Movimentacao_Caixa_userFirebase: id,
          Movimentacao_Caixa_Tipo_Movimentacao_id: type,
        })
        .orderBy("Movimentacao_Caixa_date", "desc");

      return res.status(200).json({
        data: query,
      });
    } catch (err) {
      return res.status(500).json({
        message:
          err.message ?? "Ocorreu um erro ao realizar busca por movimentações!",
      });
    }
  }

  async AllFinancialMovement(req, res) {
    const { id } = req.params;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { id: "Movimentacao_Caixa_id" },
          { product: "Movimentacao_Caixa_product" },
          { value: "Movimentacao_Caixa_value" },
          { paymode: "Movimentacao_Caixa_Paymode" },
          { date: "Movimentacao_Caixa_date" },
          {
            type: db.raw(
              `CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN 'Entries' ELSE 'Outflows' END`
            ),
          }
        )
        .where({
          Movimentacao_Caixa_userFirebase: id,
        })
        .orderBy("Movimentacao_Caixa_date", "desc");

      return res.status(200).json({
        data: query,
      });
    } catch (err) {
      return res.status(500).json({
        message:
          err.message ?? "Ocorreu um erro ao realizar busca por movimentações!",
      });
    }
  }

  async financialMovementReportList(req, res) {
    const { id, type } = req.params;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { date: "Movimentacao_Caixa_date" },
          { id: "Movimentacao_Caixa_id" },
          {
            balance: db.raw(
              `SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END) - SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)`
            ),
          }
        )
        .where({ Movimentacao_Caixa_userFirebase: id })
        .groupByRaw(
          `YEAR(Movimentacao_Caixa_Date)${
            type === "month" ? ",MONTHNAME(Movimentacao_Caixa_Date)" : ""
          }`
        )
        .orderBy("Movimentacao_Caixa_date", "desc");

      return res.status(200).json({
        data: query,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementDetail(req, res) {
    const { id, year, month } = req.params;
    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { month: "Movimentacao_Caixa_date" },
          {
            cashTotal: db.raw(
              "SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END) - SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)"
            ),
          },
          {
            expenses: db.raw(
              "SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)"
            ),
          },
          {
            entries: db.raw(
              "SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN 1 ELSE 0 END)"
            ),
          },
          {
            outflows: db.raw(
              "SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN 1 ELSE 0 END)"
            ),
          }
        )
        .where({ Movimentacao_Caixa_userFirebase: id })
        .whereRaw(`YEAR(Movimentacao_Caixa_date) = "${year}"`)
        .whereRaw(
          `${!!month ? `MONTHNAME(Movimentacao_Caixa_date) = "${month}"` : ""}`
        )
        .groupByRaw(
          "YEAR(Movimentacao_Caixa_Date), MONTHNAME(Movimentacao_Caixa_Date)"
        )
        .debug();

      !query[0] && res.status(200).json({ message: "No data!" });

      return res.status(200).json({ data: query[0] });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementReportDetailList(req, res) {
    const { id, year, month } = req.params;
    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { Descrição: "Movimentacao_Caixa_product" },
          { Valor: "Movimentacao_Caixa_value" },
          { "Tipo de pagamento": "Movimentacao_Caixa_Paymode" },
          { Data: db.raw("DATE_FORMAT(Movimentacao_Caixa_Date, '%d/%m/%Y')") },
          {
            "Tipo da movimentação": db.raw(
              "CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN 'Entrada' ELSE 'Saída' END"
            ),
          }
        )
        .where({ Movimentacao_Caixa_userFirebase: id })
        .whereRaw(
          `${!!year ? `YEAR(Movimentacao_Caixa_date) = "${year}"` : ""}`
        )
        .whereRaw(
          `${!!month ? `MONTHNAME(Movimentacao_Caixa_date) = "${month}"` : ""}`
        );

      !query && res.status(200).json({ message: "No data!" });

      return res.status(200).json({ data: query });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialBalance(req, res) {
    const { id } = req.params;
    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select({
          balance: db.raw(
            "SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END) - SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)"
          ),
        })
        .where({ Movimentacao_Caixa_userFirebase: id });
      return res.status(200).json({ data: query });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async deleteFinancialMovement(req, res) {
    const { id, idMovement } = req.params;

    try {
      await db
        .from("Movimentacao_Caixas")
        .where("Movimentacao_Caixa_id", idMovement)
        .where("Movimentacao_Caixa_userFirebase", id)
        .del();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }
}
