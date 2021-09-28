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
  "/financial-movement-detail/:id/:year/:month?",
  MovimentacaoCaixa.financialMovementDetail
);
router.delete(
  "/financial-movement-delete/:id/:idMovement",
  MovimentacaoCaixa.deleteFinancialMovement
);
router.get("/financial-balance/:id", MovimentacaoCaixa.financialBalance);
router.get(
  "/financial-report-list/:id/:type",
  MovimentacaoCaixa.financialMovementReportList
);
router.get(
  "/financial-report-list-doc/:id/:year?/:month?",
  MovimentacaoCaixa.financialMovementReportDetailList
);

export default router;
