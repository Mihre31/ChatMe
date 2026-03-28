import aj from "../lib/arcject.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

export const arcjectProtection = async (req, res, next) => {
  try {
    const isLocalDev =
      ENV.NODE_ENV === "development" &&
      (req.ip === "::1" ||
        req.ip === "127.0.0.1" ||
        req.hostname === "localhost");

    const decision = await aj.protect(req);
    if (decision.isDenied) {
      if (isLocalDev && decision.reason.isBot()) {
        console.log("Arcjet bot check bypassed for local development:", {
          path: req.path,
          method: req.method,
          ip: req.ip,
        });
        return next();
      }

      console.log("Arcjet denied request:", {
        path: req.path,
        method: req.method,
        ip: req.ip,
        reason: decision.reason,
      });

      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy" });
      }
    }

    //check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }
    next();
  } catch (error) {
    console.log("Arcjet Protection Error", error);
    next();
  }
};
