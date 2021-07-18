import db from "../database/connection";

export default class MovimentacaoCaixaController {
  async create(req, res) {
    const { id, product, value, paymode, date, time } = req.body;

    if (!id) {
      return res.status(400).send({
        message: "Necessário o userFirebaseID para realizar a criação",
      });
    }

    const mov_caixa = {
      product,
      value,
      paymode,
      date,
      time,
    };

    try {
      await db.from("Movimentacao_Caixas").insert({
        Movimentacao_Caixa_product: mov_caixa.product,
        Movimentacao_Caixa_value: mov_caixa.value,
        Movimentacao_Caixa_date: db.raw(
          'CAST(CONCAT(DATE_FORMAT(STR_TO_DATE("??", "%d/%m/%Y"),"%Y-%m-%d"),"??") AS DATETIME)',
          [mov_caixa.date, mov_caixa.time]
        ),
        Movimentacao_Caixa_userFirebase: req.params.id,
        Movimentacao_Caixa_Tipo_Movimentacao_id: req.params.type,
        Movimentacao_Caixa_Paymode: mov_caixa.paymode,
      });
    } catch (err) {
      return res.status(500).json({
        errorMessage: "Ocorreu um erro ao processar a criação da movimentação",
      });
    }
  }

  async FinancialMovement(req, res) {
    const { id, type } = req.params;
    const { page } = req.query;
    const currentPage = parseInt(page) || 1;

    const queryTotalRows = await db
      .from("Movimentacao_Caixas")
      .count("Movimentacao_Caixa_id", { as: "total" })
      .where({
        Movimentacao_Caixa_userFirebase: id,
        Movimentacao_Caixa_Tipo_Movimentacao_id: type,
      });

    if (queryTotalRows <= 0)
      return res.status(200).json({ message: "Não possui movimentações" });

    const totalRows = queryTotalRows[0].total;
    const calcTotalPages = Math.ceil(totalRows / 10);
    const countItems = currentPage * 10 - 10;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { id: "Movimentacao_Caixa_id" },
          { product: "Movimentacao_Caixa_product" },
          { value: "Movimentacao_Caixa_value" },
          { payMode: "Movimentacao_Caixa_Paymode" },
          { date: "Movimentacao_Caixa_date" }
        )
        .where({
          Movimentacao_Caixa_userFirebase: id,
          Movimentacao_Caixa_Tipo_Movimentacao_id: type,
        })
        .orderBy("Movimentacao_Caixa_date", "desc")
        .limit(10)
        .offset(countItems);

      return res.status(200).json({
        data: query,
        totalPages: calcTotalPages,
        total: totalRows,
        page: currentPage,
      });
    } catch (err) {
      return res.status(500).json({
        message:
          err.message ?? "Ocorreu um erro ao realizar busca por movimentações!",
      });
    }
  }

  async financialMovementByYear(req, res) {
    const { id } = req.params;
    const { page } = req.query;
    const currentPage = parseInt(page) || 1;

    const queryTotalRows = await db
      .from("Movimentacao_Caixas")
      .count("Movimentacao_Caixa_date")
      .where({
        Movimentacao_Caixa_userFirebase: id,
      })
      .groupByRaw("YEAR(Movimentacao_Caixa_Date)");

    if (queryTotalRows <= 0)
      return res.status(200).json({ message: "Não possui movimentações" });

    const totalRows = queryTotalRows.length;
    const calcTotalPages = Math.ceil(totalRows / 10);
    const countItems = currentPage * 10 - 10;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { year: db.raw("YEAR(Movimentacao_Caixa_date)") },
          {
            balance: db.raw(
              `SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END) - SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)`
            ),
          }
        )
        .where({ Movimentacao_Caixa_userFirebase: id })
        .groupByRaw("YEAR(Movimentacao_Caixa_Date)")
        .orderBy("Movimentacao_Caixa_date", "desc")
        .limit(10)
        .offset(countItems);

      return res.status(200).json({
        data: query,
        totalPages: calcTotalPages,
        total: totalRows,
        page: currentPage,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementByMonth(req, res) {
    const { id } = req.params;
    const { page } = req.query;
    const currentPage = parseInt(page) || 1;

    const queryTotalRows = await db
      .from("Movimentacao_Caixas")
      .count("Movimentacao_Caixa_date")
      .where({
        Movimentacao_Caixa_userFirebase: id,
      })
      .groupByRaw(
        "YEAR(Movimentacao_Caixa_Date), MONTHNAME(Movimentacao_Caixa_Date)"
      );

    if (queryTotalRows <= 0)
      return res.status(200).json({ message: "Não possui movimentações" });

    const totalRows = queryTotalRows.length;
    const calcTotalPages = Math.ceil(totalRows / 10);
    const countItems = currentPage * 10 - 10;

    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
          { date: db.raw("Movimentacao_Caixa_date") },
          { id: "Movimentacao_Caixa_id" },
          {
            balance: db.raw(
              `SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END) - SUM(CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN Movimentacao_Caixa_value ELSE 0 END)`
            ),
          }
        )
        .where({ Movimentacao_Caixa_userFirebase: id })
        .groupByRaw(
          "YEAR(Movimentacao_Caixa_Date), MONTHNAME(Movimentacao_Caixa_Date)"
        )
        .orderBy("Movimentacao_Caixa_date", "desc")
        .limit(10)
        .offset(countItems)
        .debug();

      return res.status(200).json({
        data: query,
        totalPages: calcTotalPages,
        total: totalRows,
        page: currentPage,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementDetailYear(req, res) {
    const { id, year } = req.params;
    try {
      const query = await db
        .from("Movimentacao_Caixas")
        .select(
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
        .groupByRaw("YEAR(Movimentacao_Caixa_Date)");

      !!query[0] && res.status(200).json({ data: { ...query[0], year } });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementDetailMonth(req, res) {
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
        .whereRaw(`MONTHNAME(Movimentacao_Caixa_date) = "${month}"`)
        .groupByRaw(
          "YEAR(Movimentacao_Caixa_Date), MONTHNAME(Movimentacao_Caixa_Date)"
        );

      !query[0] && res.status(200).json({ message: "No data!" });

      return res.status(200).json({ data: query[0] });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving.",
      });
    }
  }

  async financialMovementDelete(req, res) {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }
    try {
      await db
        .from("Movimentacao_Caixas")
        .where({ Movimentacao_Caixa_id: id })
        .del();

      return res.status(200).json({ success: true });
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
}
