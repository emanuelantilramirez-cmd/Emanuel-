import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing and static assets setup
  app.use(express.json());

  // Simple status API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "IA Trading Engine Online" });
  });

  // Mock OpenAI or external broker API for simulated real money integration
  app.post("/api/broker/deposit", (req, res) => {
    const { amount, method } = req.body;
    res.json({
      success: true,
      transactionId: `TXN-${Math.floor(Math.random() * 900000 + 100000)}`,
      amount,
      method,
      cleared: true,
      timestamp: new Date().toISOString()
    });
  });

  // Integrate Vite or Serve Static Files based on Node Environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Trading Server is listening on http://localhost:${PORT}`);
  });
}

startServer();
