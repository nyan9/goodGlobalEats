/**
 * Auth.js v5 Pages Router catch-all handler.
 *
 * The v5 `handlers.GET` / `handlers.POST` expect a Fetch-API `NextRequest`.
 * We build a standard Web `Request` from the incoming Node `NextApiRequest`,
 * invoke the appropriate handler, then pipe the Web `Response` back to the
 * Node `NextApiResponse`.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import { handlers } from "../../../auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method?.toUpperCase();

  // Build a full URL for the Web Request
  const host =
    req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:3000";
  const protocol =
    (req.headers["x-forwarded-proto"] as string | undefined) ?? "http";
  const url = `${protocol}://${host}${req.url}`;

  // Convert Node headers to Fetch Headers
  const webHeaders = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach((v) => webHeaders.append(key, v));
    } else if (value !== undefined) {
      webHeaders.set(key, value);
    }
  }

  // Read the body for POST requests
  let body: string | undefined;
  if (method === "POST") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks).toString();
  }

  // Cast to NextRequest — the handlers only use standard Fetch API surface
  // (url, method, headers, body) which a plain Request satisfies at runtime.
  const webRequest = new Request(url, {
    method,
    headers: webHeaders,
    body: body ?? null,
  }) as unknown as NextRequest;

  const webHandler = method === "POST" ? handlers.POST : handlers.GET;
  const webResponse = await webHandler(webRequest);

  // Pipe status
  res.status(webResponse.status);

  // Pipe response headers back
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      res.setHeader("set-cookie", value);
    } else {
      res.setHeader(key, value);
    }
  });

  // Pipe body
  const responseBody = await webResponse.text();
  res.end(responseBody);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
