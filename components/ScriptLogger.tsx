"use client";

import { useEffect } from "react";

const ScriptLogger = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Function to log all scripts in head and body
    const logScripts = () => {
      console.log("=== SCRIPT LOADING DIAGNOSTIC ===");
      console.log(
        "HEAD SCRIPTS:",
        document.head.querySelectorAll("script").length
      );
      document.head.querySelectorAll("script").forEach((script, i) => {
        console.log(
          `Head Script ${i}:`,
          script.id || "(no id)",
          script.src || "(inline)"
        );
      });

      console.log(
        "BODY SCRIPTS:",
        document.body.querySelectorAll("script").length
      );
      document.body.querySelectorAll("script").forEach((script, i) => {
        console.log(
          `Body Script ${i}:`,
          script.id || "(no id)",
          script.src || "(inline)"
        );
      });
      console.log("================================");
    };

    // Log scripts after page is fully loaded
    window.addEventListener("load", logScripts);

    // Cleanup
    return () => window.removeEventListener("load", logScripts);
  }, []);

  return null;
};

export default ScriptLogger;
