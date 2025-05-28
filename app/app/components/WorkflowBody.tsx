"use client";

import { useDocumentsStore } from "../store/documentsStore";
import { useState, useEffect } from "react";
import AIChatInterface from "./AIChatInterface";

const WorkflowBody = () => {
  const { workflowTabs, activeWorkflowTab } = useDocumentsStore();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [highlightArea, setHighlightArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatHeight, setChatHeight] = useState(300); // Reduced default chat height
  const [isResizing, setIsResizing] = useState(false);

  const activeTab = workflowTabs.find((tab) => tab.id === activeWorkflowTab);

  useEffect(() => {
    if (activeTab?.file) {
      const url = URL.createObjectURL(activeTab.file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
    }
  }, [activeTab?.file]);

  const handleHighlight = (
    area: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null
  ) => {
    setHighlightArea(area);
    if (area) {
      setTimeout(() => setHighlightArea(null), 5000); // Remove highlight after 5 seconds
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const containerRect = document
        .getElementById("workflow-container")
        ?.getBoundingClientRect();
      if (!containerRect) return;

      const newChatHeight = containerRect.bottom - e.clientY;

      // Constrain chat height between 200px and 60% of container height (reduced max)
      const minHeight = 200;
      const maxHeight = containerRect.height * 0.6;
      const constrainedHeight = Math.max(
        minHeight,
        Math.min(maxHeight, newChatHeight)
      );

      setChatHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  if (!activeTab) {
    return (
      <div
        id="workflow-container"
        className="h-[calc(100vh-64px-44px)] flex flex-col overflow-hidden"
      >
        {/* Empty state content */}
        <div className="flex-1 flex items-center justify-center text-gray-500 min-h-0">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2">No file selected</h3>
            <p className="text-sm">
              Drag files from Documents or Forms to the header to create tabs
              and view content
            </p>
          </div>
        </div>

        {/* Resize handle */}
        {!isChatMinimized && (
          <div
            className="h-1 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors relative group flex-shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-x-0 -top-1 -bottom-1 group-hover:bg-blue-400 group-hover:bg-opacity-20" />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gray-400 rounded group-hover:bg-blue-600" />
          </div>
        )}

        {/* AI Chat Interface */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ height: isChatMinimized ? "auto" : `${chatHeight}px` }}
        >
          <AIChatInterface
            onHighlight={handleHighlight}
            isMinimized={isChatMinimized}
            onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          />
        </div>
      </div>
    );
  }

  const renderFileContent = () => {
    const fileType = activeTab.file.type;
    const fileName = activeTab.file.name.toLowerCase();

    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      if (!fileUrl) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <p>Loading PDF...</p>
            </div>
          </div>
        );
      }
      return (
        <div className="w-full h-full relative">
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            width="100%"
            height="100%"
            style={{
              border: "none",
              display: "block",
              margin: 0,
              padding: 0,
              backgroundColor: "#111",
            }}
            title={activeTab.name}
          />
          {/* Highlight overlay */}
          {highlightArea && (
            <div
              className="absolute border-2 border-yellow-400 bg-yellow-200 bg-opacity-30 animate-pulse"
              style={{
                left: `${highlightArea.x}px`,
                top: `${highlightArea.y}px`,
                width: `${highlightArea.width}px`,
                height: `${highlightArea.height}px`,
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      );
    }

    if (fileType.includes("image")) {
      if (!fileUrl) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🖼️</div>
              <p>Loading image...</p>
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-start justify-center p-4 mb-8 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt={activeTab.name}
            className="max-w-full h-auto object-contain"
          />
          {/* Highlight overlay */}
          {highlightArea && (
            <div
              className="absolute border-2 border-yellow-400 bg-yellow-200 bg-opacity-30 animate-pulse"
              style={{
                left: `${highlightArea.x}px`,
                top: `${highlightArea.y}px`,
                width: `${highlightArea.width}px`,
                height: `${highlightArea.height}px`,
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      );
    }

    if (
      fileType.includes("text") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md")
    ) {
      return (
        <div className="p-4 h-full overflow-auto">
          <FileTextViewer file={activeTab.file} />
        </div>
      );
    }

    // Default fallback for other file types
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">{activeTab.name}</h3>
          <p className="text-sm mb-4">File type: {fileType || "Unknown"}</p>
          <p className="text-sm text-gray-400">
            Preview not available for this file type
          </p>{" "}
          <button
            onClick={() => {
              if (fileUrl) {
                const a = document.createElement("a");
                a.href = fileUrl;
                a.download = activeTab.name;
                a.click();
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!fileUrl}
          >
            {fileUrl ? "Download File" : "Preparing download..."}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      id="workflow-container"
      className="h-[calc(100vh-64px-44px)] bg-white flex flex-col overflow-hidden"
    >
      {/* File content area - takes remaining space above chat */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* File info header */}
        <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {activeTab.name}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  activeTab.type === "petitioner"
                    ? "bg-blue-100 text-blue-600"
                    : activeTab.type === "beneficiary"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                }`}
              >
                {activeTab.type}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {(activeTab.file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>

        {/* File content - scrollable area */}
        <div className="flex-1 min-h-0 overflow-auto">
          {renderFileContent()}
        </div>
      </div>

      {/* Resize handle */}
      {!isChatMinimized && (
        <div
          className="h-1 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors relative group flex-shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-x-0 -top-1 -bottom-1 group-hover:bg-blue-400 group-hover:bg-opacity-20" />
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gray-400 rounded group-hover:bg-blue-600" />
        </div>
      )}

      {/* AI Chat Interface - fixed height with own scroll */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ height: isChatMinimized ? "auto" : `${chatHeight}px` }}
      >
        <AIChatInterface
          onHighlight={handleHighlight}
          isMinimized={isChatMinimized}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
        />
      </div>
    </div>
  );
};

// Component for text file viewing
const FileTextViewer = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent((e.target?.result as string) || "");
      setLoading(false);
    };
    reader.readAsText(file);
  }, [file]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded border overflow-auto">
      {content}
    </pre>
  );
};

export default WorkflowBody;
