"use client";

import { useEffect } from "react";

type HeadScriptsProps = {
  headScript?: string | null;
};

const HeadScripts = ({ headScript }: HeadScriptsProps) => {
  useEffect(() => {
    if (!headScript) return;

    // Create a script element and append it to the head
    const script = document.createElement("script");
    script.innerHTML = headScript;
    script.id = "dynamic-head-script";

    // Remove any existing script with same id
    const existingScript = document.getElementById("dynamic-head-script");
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    // Cleanup when component unmounts
    return () => {
      const scriptToRemove = document.getElementById("dynamic-head-script");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [headScript]);

  return null; // This component doesn't render anything
};

export default HeadScripts;
