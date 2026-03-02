#!/usr/bin/env node
import dns from "node:dns/promises";
import net from "node:net";
import { performance } from "node:perf_hooks";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, ...rest] = arg.split("=");
    return [k.replace(/^--/, ""), rest.join("=")];
  }),
);

const domain = args.domain || "suntaili.com";
const webHost = args.webHost || `www.${domain}`;
const ftpHost = args.ftpHost || webHost;
const ftpPort = Number(args.ftpPort || 21);
const timeoutMs = Number(args.timeoutMs || 8000);
const ftpUser = process.env.FTP_USER || args.ftpUser || "";
const ftpPass = process.env.FTP_PASS || args.ftpPass || "";
const doAdminScan = toBool(args.adminScan, true);
const doFtpWriteTest = toBool(args.ftpWriteTest, false);
const ftpDir = args.ftpDir || "/images";
const ftpCleanup = toBool(args.ftpCleanup, true);

function toBool(value, fallback = false) {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function section(title) {
  console.log(`\n=== ${title} ===`);
}

function mask(value) {
  if (!value) return "(empty)";
  if (value.length <= 3) return "***";
  return `${value.slice(0, 2)}***${value.slice(-1)}`;
}

async function checkDns(targetDomain) {
  section(`DNS: ${targetDomain}`);
  try {
    const [a4, a6, ns] = await Promise.allSettled([
      dns.resolve4(targetDomain),
      dns.resolve6(targetDomain),
      dns.resolveNs(targetDomain),
    ]);

    if (a4.status === "fulfilled") console.log("A:", a4.value.join(", "));
    else console.log("A: (not found)");

    if (a6.status === "fulfilled") console.log("AAAA:", a6.value.join(", "));
    else console.log("AAAA: (not found)");

    if (ns.status === "fulfilled") console.log("NS:", ns.value.join(", "));
    else console.log("NS: (not found)");
  } catch (error) {
    console.log("DNS lookup failed:", error.message);
  }
}

function checkTcp(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = net.createConnection({ host, port });
    let done = false;

    const finish = (ok, detail) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({
        ok,
        host,
        port,
        ms: Math.round(performance.now() - start),
        detail,
      });
    };

    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true, "connected"));
    socket.once("timeout", () => finish(false, "timeout"));
    socket.once("error", (error) => finish(false, error.code || error.message));
  });
}

async function checkHttp(url, timeout = 8000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    clearTimeout(t);
    return {
      ok: true,
      url,
      status: res.status,
      ms: Math.round(performance.now() - start),
      server: res.headers.get("server") || "",
      location: res.headers.get("location") || "",
    };
  } catch (error) {
    clearTimeout(t);
    return {
      ok: false,
      url,
      status: 0,
      ms: Math.round(performance.now() - start),
      server: "",
      location: "",
      error: error.name === "AbortError" ? "timeout" : error.message,
    };
  }
}

async function scanAdminPaths(host, timeout = 8000) {
  section("Admin Path Scan");
  const candidates = [
    "/admin",
    "/administrator",
    "/backend",
    "/manage",
    "/manager",
    "/cms",
    "/wp-admin",
    "/user/login",
    "/login",
  ];

  for (const path of candidates) {
    const result = await checkHttp(`http://${host}${path}`, timeout);
    if (!result.ok) {
      console.log(`${path} => FAIL (${result.error})`);
      continue;
    }

    const interesting = [200, 301, 302, 401, 403].includes(result.status);
    if (interesting) {
      console.log(
        `${path} => ${result.status} server=${result.server || "-"} location=${result.location || "-"}`,
      );
    } else {
      console.log(`${path} => ${result.status}`);
    }
  }
}

function readLine(socket, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("read timeout"));
    }, timeout);

    const cleanup = () => {
      clearTimeout(timer);
      socket.off("data", onData);
      socket.off("error", onError);
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      if (buffer.includes("\n")) {
        cleanup();
        resolve(buffer.trim());
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

function sendFtpCommand(socket, command) {
  socket.write(`${command}\r\n`);
}

async function ftpCommand(socket, command, timeout) {
  sendFtpCommand(socket, command);
  return readLine(socket, timeout);
}

function parsePasvResponse(resp) {
  const match = resp.match(/\((\d+,\d+,\d+,\d+),(\d+),(\d+)\)/);
  if (!match) {
    const fallback = resp.match(/\((\d+,\d+,\d+,\d+,\d+,\d+)\)/);
    if (!fallback) return null;
    const parts = fallback[1].split(",").map(Number);
    return {
      host: `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}`,
      port: parts[4] * 256 + parts[5],
    };
  }
  return {
    host: match[1].replaceAll(",", "."),
    port: Number(match[2]) * 256 + Number(match[3]),
  };
}

async function ftpWriteProbe(socket, timeout, targetDir = "/images", cleanup = true) {
  console.log(`Write probe dir: ${targetDir}`);
  const cwdReply = await ftpCommand(socket, `CWD ${targetDir}`, timeout);
  console.log("CWD reply:", cwdReply);
  if (!cwdReply.startsWith("250")) {
    return { ok: false, reason: "CWD failed" };
  }

  const testName = `codex_probe_${Date.now()}.txt`;
  const testContent = `codex-probe ${new Date().toISOString()}\n`;

  const typeReply = await ftpCommand(socket, "TYPE I", timeout);
  console.log("TYPE reply:", typeReply);

  const pasvReply = await ftpCommand(socket, "PASV", timeout);
  console.log("PASV reply:", pasvReply);
  const pasv = parsePasvResponse(pasvReply);
  if (!pasv) return { ok: false, reason: "PASV parse failed" };

  const dataSocket = await new Promise((resolve, reject) => {
    const s = net.createConnection({ host: pasv.host, port: pasv.port });
    s.setTimeout(timeout);
    s.once("connect", () => resolve(s));
    s.once("timeout", () => reject(new Error("data socket timeout")));
    s.once("error", reject);
  });

  sendFtpCommand(socket, `STOR ${testName}`);
  const storPre = await readLine(socket, timeout);
  console.log("STOR pre-reply:", storPre);

  if (!storPre.startsWith("150") && !storPre.startsWith("125")) {
    dataSocket.destroy();
    return { ok: false, reason: "STOR pre-reply failed" };
  }

  dataSocket.write(testContent);
  dataSocket.end();

  const storDone = await readLine(socket, timeout);
  console.log("STOR done reply:", storDone);
  if (!storDone.startsWith("226") && !storDone.startsWith("250")) {
    return { ok: false, reason: "STOR complete failed" };
  }

  if (cleanup) {
    const delReply = await ftpCommand(socket, `DELE ${testName}`, timeout);
    console.log("DELE reply:", delReply);
  } else {
    console.log(`Probe file kept: ${targetDir}/${testName}`);
  }

  return { ok: true, filename: testName };
}

async function checkFtpLogin({
  host,
  port,
  user,
  pass,
  timeout = 8000,
  writeTest = false,
  writeDir = "/images",
  writeCleanup = true,
}) {
  section(`FTP: ${host}:${port}`);
  const socket = net.createConnection({ host, port });
  socket.setTimeout(timeout);

  try {
    const banner = await readLine(socket, timeout);
    console.log("Banner:", banner);

    if (!user || !pass) {
      sendFtpCommand(socket, "AUTH TLS");
      const authTlsReply = await readLine(socket, timeout).catch(() => "");
      if (authTlsReply) console.log("AUTH TLS:", authTlsReply);
      console.log("Skip login: provide FTP_USER / FTP_PASS to test credentials.");
      sendFtpCommand(socket, "QUIT");
      return;
    }

    console.log("USER:", mask(user));
    const userReply = await ftpCommand(socket, `USER ${user}`, timeout);
    console.log("USER reply:", userReply);

    const passReply = await ftpCommand(socket, `PASS ${pass}`, timeout);
    console.log("PASS reply:", passReply);

    if (passReply.startsWith("230")) {
      const pwdReply = await ftpCommand(socket, "PWD", timeout).catch(() => "(no PWD reply)");
      console.log("PWD reply:", pwdReply);
      console.log("FTP login result: SUCCESS");

      if (writeTest) {
        const probe = await ftpWriteProbe(socket, timeout, writeDir, writeCleanup);
        console.log(
          `FTP write probe: ${probe.ok ? "SUCCESS" : `FAILED (${probe.reason || "unknown"})`}`,
        );
      }
    } else if (passReply.startsWith("534")) {
      console.log("FTP login result: FAILED (server requires secure/TLS login)");
    } else {
      console.log("FTP login result: FAILED");
    }

    sendFtpCommand(socket, "QUIT");
  } catch (error) {
    console.log("FTP check failed:", error.message);
  } finally {
    socket.destroy();
  }
}

async function main() {
  console.log("Host Diagnose Tool");
  console.log(`domain=${domain}, webHost=${webHost}, ftpHost=${ftpHost}, ftpPort=${ftpPort}`);

  await checkDns(domain);

  section("TCP");
  for (const port of [21, 80, 443]) {
    const result = await checkTcp(webHost, port, timeoutMs);
    console.log(
      `${result.host}:${result.port} => ${result.ok ? "OK" : "FAIL"} (${result.ms}ms, ${result.detail})`,
    );
  }

  section("HTTP");
  for (const url of [`http://${webHost}/`, `http://${webHost}/admin`]) {
    const r = await checkHttp(url, timeoutMs);
    if (r.ok) {
      console.log(
        `${r.url} => ${r.status} (${r.ms}ms) server=${r.server || "-"} location=${r.location || "-"}`,
      );
    } else {
      console.log(`${r.url} => FAIL (${r.ms}ms) error=${r.error}`);
    }
  }

  if (doAdminScan) {
    await scanAdminPaths(webHost, timeoutMs);
  }

  await checkFtpLogin({
    host: ftpHost,
    port: ftpPort,
    user: ftpUser,
    pass: ftpPass,
    timeout: timeoutMs,
    writeTest: doFtpWriteTest,
    writeDir: ftpDir,
    writeCleanup: ftpCleanup,
  });
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
