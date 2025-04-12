"use client";

import Script from "next/script";

type PageScriptsProps = {
  headScript?: string | null;
  bodyScript?: string | null;
};

const PageScripts = ({ headScript, bodyScript }: PageScriptsProps) => {
  return (
    <>
      {headScript && (
        <Script
          id="page-head-script"
          dangerouslySetInnerHTML={{ __html: headScript }}
          strategy="beforeInteractive"
        />
      )}

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
