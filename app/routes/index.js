import express from "express";
import CaixaSaldoController from "../controllers/caixaSaldo.controller";
import MovimentacaoCaixaController from "../controllers/movimentacaoCaixa.controller";

const router = express.Router();

const CaixaSaldo = new CaixaSaldoController();
const MovimentacaoCaixa = new MovimentacaoCaixaController();

router.post("/create-saldo", CaixaSaldo.create);

router.post("/create-mov/:id/:type", MovimentacaoCaixa.create);
router.get(
  "/financial-movement/:id/:type",
  MovimentacaoCaixa.FinancialMovement
);
router.get(
  "/financial-movement-by-year/:id",
  MovimentacaoCaixa.financialMovementByYear
);
router.get(
  "/financial-movement-detail-year/:id/:year",
  MovimentacaoCaixa.financialMovementDetailYear
);
router.get(
  "/financial-movement-by-month/:id",
  MovimentacaoCaixa.financialMovementByMonth
);
router.get(
  "/financial-movement-detail-month/:id/:month/:year",
  MovimentacaoCaixa.financialMovementDetailMonth
);
router.delete(
  "/financial-movement-delete/",
  MovimentacaoCaixa.financialMovementDelete
);
router.get("/financial-balance/:id", MovimentacaoCaixa.financialBalance);

export default router;
