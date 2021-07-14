import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./app/routes";

dotenv.config({ path: ".env" });
const app = express();
const port = process.env.PORT || 5000;
const host = "0.0.0.0";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(routes);
app.set("keySecret", process.env.PRIVATE_KEY);

app.listen(port, host, () => {
  console.log("Aplicação rodando na porta 5000");
});
