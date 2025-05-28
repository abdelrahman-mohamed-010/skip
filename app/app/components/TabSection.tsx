import React from "react";
import DocumentsTab from "./DocumentsTab";

const TabSection = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 min-h-0">
        <DocumentsTab />
      </div>
    </div>
  );
};

export default TabSection;
