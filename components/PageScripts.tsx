"use client";

import HeadScripts from "./HeadScripts";
import BodyScripts from "./BodyScripts";

type PageScriptsProps = {
  headScript?: string | null;
  bodyScript?: string | null;
};

const PageScripts = ({ headScript, bodyScript }: PageScriptsProps) => {
  return (
    <>
      {/* Component to add scripts directly to head */}
      {headScript && <HeadScripts headScript={headScript} />}

      {/* Component to add scripts directly to body */}
      {bodyScript && <BodyScripts bodyScript={bodyScript} />}
    </>
  );
};

export default PageScripts;
