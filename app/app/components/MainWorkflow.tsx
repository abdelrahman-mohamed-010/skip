"use client";

import React from "react";
import WorkFlowHeader from "./WorkFlowHeader";
import WorkflowBody from "./WorkflowBody";

const MainWorkflow = () => {
  return (
    <div className="w-[calc(100vw-288px)] h-full">
      <WorkFlowHeader />
      <WorkflowBody />
    </div>
  );
};

export default MainWorkflow;
