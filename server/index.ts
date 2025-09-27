import express, { type Request, Response, NextFunction } from "express";
import http from "http";
import { connectDB } from "./config/database";
import { apiRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await connectDB();
  
  app.use('/api', apiRoutes);
  
  const server = http.createServer(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in dev mode
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 🔥 Random host (safe for Windows)
  const possibleHosts = ["127.0.0.1", "localhost"];
  const host = possibleHosts[Math.floor(Math.random() * possibleHosts.length)];

  // 🔥 Port: use env PORT or random between 4000–6000
  const port =
    process.env.PORT !== undefined
      ? parseInt(process.env.PORT, 10)
      : Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;

  server.listen(port, host, () => {
    log(`🚀 serving on http://${host}:${port}`);
  });
})();
