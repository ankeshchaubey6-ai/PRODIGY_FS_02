const net = require("net");
const { spawn } = require("child_process");

const DEFAULT_PORT = 3006;
const MAX_PORT_ATTEMPTS = 20;

function parsePort(value) {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }

  return port;
}

function canListen(port, host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }

      reject(error);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen({
      port,
      host,
      exclusive: true,
    });
  });
}

async function isPortAvailable(port) {
  const ipv6Available = await canListen(port, "::");

  if (!ipv6Available) {
    return false;
  }

  return canListen(port, "0.0.0.0");
}

async function findAvailablePort(startPort) {
  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset += 1) {
    const port = startPort + offset;

    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(
    `No available port found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}.`
  );
}

async function main() {
  const requestedPort = parsePort(process.env.PORT) ?? DEFAULT_PORT;
  const port = await findAvailablePort(requestedPort);

  if (port !== requestedPort) {
    console.warn(
      `[dev] Port ${requestedPort} is in use. Starting Next.js on port ${port} instead.`
    );
  }

  const nextBin = require.resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("[dev] Failed to start Next.js:", error);
  process.exit(1);
});
