import React from "react";
import LeftSidebar from "./LeftSidebar";
import MainWorkspaceContent from "./MainWorkspaceContent";

const WorkspaceLayout = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainWorkspaceContent />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
