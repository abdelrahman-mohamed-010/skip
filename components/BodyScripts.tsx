"use client";

import { useEffect } from "react";

type BodyScriptsProps = {
  bodyScript?: string | null;
};

const BodyScripts = ({ bodyScript }: BodyScriptsProps) => {
  useEffect(() => {
    if (!bodyScript) return;

    // Generate unique ID to avoid conflicts with multiple script insertions
    const scriptId = `dynamic-body-script-${Math.random().toString(36).substring(2, 9)}`;

    // Check if the script content already includes script tags
    const containsScriptTags = /<script[\s\S]*?>([\s\S]*?)<\/script>/i.test(
      bodyScript
    );

    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = bodyScript;

    // Function to check if a script with same content already exists
    const scriptExists = (content: string) => {
      const existingScripts = document.body.getElementsByTagName("script");
      return Array.from(existingScripts).some(
        (script) =>
          script.innerHTML.trim() === content.trim() || script.src === content
      );
    };

    if (containsScriptTags) {
      // Handle content with script tags
      const scripts = tempContainer.getElementsByTagName("script");
      Array.from(scripts).forEach((scriptEl) => {
        // Skip if this script already exists
        if (scriptEl.innerHTML && scriptExists(scriptEl.innerHTML)) {
          return;
        }
        if (scriptEl.src && scriptExists(scriptEl.src)) {
          return;
        }

        const newScript = document.createElement("script");
        // Copy attributes
        Array.from(scriptEl.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = scriptEl.innerHTML;
        newScript.setAttribute("data-script-id", scriptId);
        document.body.appendChild(newScript);
      });

      // Handle non-script elements
      const nonScriptElements = Array.from(tempContainer.children).filter(
        (el) => el.tagName.toLowerCase() !== "script"
      );

      nonScriptElements.forEach((el) => {
        const existingElement = document.body.querySelector(
          `[data-element-id="${scriptId}"]`
        );
        if (!existingElement) {
          el.setAttribute("data-element-id", scriptId);
          document.body.appendChild(el);
        }
      });
    } else {
      // Handle raw script content
      if (!scriptExists(bodyScript)) {
        const script = document.createElement("script");
        script.innerHTML = bodyScript;
        script.setAttribute("data-script-id", scriptId);
        document.body.appendChild(script);
      }
    }

    // Cleanup when component unmounts
    return () => {
      // Remove scripts
      const scriptsToRemove = document.querySelectorAll(
        `[data-script-id="${scriptId}"]`
      );
      scriptsToRemove.forEach((script) => script.remove());

      // Remove other elements
      const elementsToRemove = document.querySelectorAll(
        `[data-element-id="${scriptId}"]`
      );
      elementsToRemove.forEach((element) => element.remove());
    };
  }, [bodyScript]);

  return null;
};

export default BodyScripts;
