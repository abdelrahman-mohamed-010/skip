"use client";

import Script from "next/script";
import HeadScripts from "./HeadScripts";

type PageScriptsProps = {
  headScript?: string | null;
  bodyScript?: string | null;
};

const PageScripts = ({ headScript, bodyScript }: PageScriptsProps) => {
  return (
    <>
      {/* Component to add scripts directly to head */}
      {headScript && <HeadScripts headScript={headScript} />}

      {/* Body scripts with afterInteractive strategy */}
      {bodyScript && (
        <Script
          id="page-body-script"
          dangerouslySetInnerHTML={{ __html: bodyScript }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
};

export default PageScripts;
