import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    status: "ok",
    message: "API do Panorama Orçamentário da PNP em execução",
  });
});

app.get("/budget", async (_request, response) => {
  try {
    const indicators = await prisma.budgetIndicator.findMany({
      orderBy: {
        id: "asc",
      },
    });

    response.json(indicators);
  } catch (error) {
    console.error("Erro ao consultar indicadores:", error);

    response.status(500).json({
      error: "Erro interno ao consultar o panorama orçamentário.",
    });
  }
});

app.get("/budget/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (Number.isNaN(id)) {
    response.status(400).json({
      error: "O id informado deve ser numérico.",
    });
    return;
  }

  try {
    const indicator = await prisma.budgetIndicator.findUnique({
      where: {
        id,
      },
    });

    if (!indicator) {
      response.status(404).json({
        error: "Indicador orçamentário não encontrado.",
      });
      return;
    }

    response.json(indicator);
  } catch (error) {
    console.error("Erro ao consultar indicador:", error);

    response.status(500).json({
      error: "Erro interno ao consultar o indicador orçamentário.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});