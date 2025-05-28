import React from "react";
import TabSection from "./TabSection";

const LeftSidebar = () => {
  return (
    <div className="w-72 border-r border-slate-200 flex flex-col bg-white h-full">
      <div className="flex-[6] min-h-0">
        <TabSection />
      </div>
      <div className="p-6 flex-[4] bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">To-Do List</h2>
            <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
              0 tasks
            </span>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-center text-center p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">
                  All caught up!
                </p>
                <p className="text-xs text-slate-500">
                  No pending tasks at the moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
