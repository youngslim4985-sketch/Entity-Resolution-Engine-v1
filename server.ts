import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ANALYST_PROMPTS } from "./server/prompts";
import { getClusterContext, CLUSTER_RECORDS } from "./server/context";
import { AnalystReport } from "./src/types";
import { controller } from "./server/stability/adaptive-control";
import { calculateEntropy } from "./server/stability/entropy";
import { generateCertificate } from "./server/stability/certificate";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json());

  // API Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Analyst Report Generation
  app.post("/api/report/generate", async (req, res) => {
    try {
      const { clusterId, type } = req.body;
      const context = getClusterContext(clusterId);
      const promptBase = ANALYST_PROMPTS[type as keyof typeof ANALYST_PROMPTS] || ANALYST_PROMPTS.narrative;

      const prompt = `${promptBase}\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}\n\nGenerate a detailed intelligence report in Markdown format.`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      const output = result.text;
      const startTime = Date.now();

      // Stability Logic
      const entropy = calculateEntropy(output);
      const confidence = 0.85 + (Math.random() * 0.1); // Simulated confidence
      const latency = Date.now() - startTime;
      const { state } = controller.processCycle(confidence, latency);
      const certificate = generateCertificate(state, clusterId);

      const report: AnalystReport = {
        id: `REP-${Math.random().toString(36).substring(7).toUpperCase()}`,
        type: type as any,
        timestamp: new Date().toISOString(),
        summary: `Intelligence briefing for ${context.name}`,
        content: output,
        riskScore: context.riskLevel === 'CRITICAL' ? 95 : context.riskLevel === 'HIGH' ? 75 : 20,
        tags: context.assets,
        metrics: {
          volume24h: "$1.2M",
          flowDirection: "Mixed",
          anomalyScore: context.riskLevel === 'CRITICAL' ? 0.98 : 0.12
        },
        stability: { ...state, entropy },
        certificate
      };

      res.json(report);
    } catch (error: any) {
      console.error("Analyst Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Smart Money Brief endpoint
  app.get("/api/report/brief", async (req, res) => {
    try {
      const prompt = `${ANALYST_PROMPTS.brief}\n\nCONTEXT:\n${JSON.stringify(CLUSTER_RECORDS, null, 2)}`;
      
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ content: result.text });
    } catch (error: any) {
      res.status(500).json({ error: "Brief generation failed" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
