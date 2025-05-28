import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentsStore } from "../store/documentsStore";
import AIAutoFillModal from "./AIAutoFillModal";
import AIProcessingOverlay from "./AIProcessingOverlay";

const WorkFlowHeader = () => {
  const router = useRouter();
  const [isAIFill, setIsAIFill] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    workflowTabs,
    activeWorkflowTab,
    setActiveWorkflowTab,
    removeWorkflowTab,
    reorderWorkflowTabs,
    petitionerFiles,
    beneficiaryFiles,
    formFiles,
  } = useDocumentsStore();
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [isDragOverHeader, setIsDragOverHeader] = useState(false);
  // Calculate total files for AI processing
  const totalFiles =
    petitionerFiles.length + beneficiaryFiles.length + formFiles.length;
  const totalDocuments = petitionerFiles.length + beneficiaryFiles.length;
  // Handle AI toggle with confirmation
  const handleAIToggle = (newValue: boolean) => {
    if (newValue) {
      // Check if there are no documents at all
      if (totalDocuments === 0) {
        alert(
          "Please upload some documents first before enabling AI Auto Fill."
        );
        return;
      }

      setShowAIModal(true);
    } else {
      setIsAIFill(newValue);
    }
  }; // Handle package submission
  const handlePackageSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate submission loading
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate confirmation number
      const confirmationNumber = `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Navigate directly to the success page
      router.push(
        `/app/package-submitted?confirmation=${confirmationNumber}&type=Immigration Package&files=${workflowTabs.length}`
      );
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle AI auto-fill confirmation
  const handleAIConfirm = async () => {
    setShowAIModal(false);
    setIsAIFill(true);
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate AI processing with steps
    const steps = [
      { message: "Analyzing documents...", duration: 1500 },
      { message: "Extracting information...", duration: 2000 },
      { message: "Processing data...", duration: 1800 },
      { message: "Filling forms...", duration: 2200 },
      { message: "Finalizing...", duration: 1000 },
    ];

    let currentProgress = 0;
    const progressIncrement = 100 / steps.length;

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i].message);

      // Simulate progress within each step
      const stepStart = currentProgress;
      const stepEnd = (i + 1) * progressIncrement;

      const stepDuration = steps[i].duration;
      const progressSteps = 10;
      const progressInterval = stepDuration / progressSteps;

      for (let j = 0; j < progressSteps; j++) {
        await new Promise((resolve) => setTimeout(resolve, progressInterval));
        const stepProgress =
          stepStart + ((stepEnd - stepStart) * (j + 1)) / progressSteps;
        setProcessingProgress(stepProgress);
      }

      currentProgress = stepEnd;
    } // Show completion for a moment
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add all form files to workflow tabs for review
    const store = useDocumentsStore.getState();
    formFiles.forEach((formFile) => {
      // Check if this form is not already in the workflow tabs
      const isAlreadyInTabs = workflowTabs.some(
        (tab) => tab.file.name === formFile.name && tab.type === "form"
      );

      if (!isAlreadyInTabs) {
        store.addWorkflowTab(formFile, "form");
      }
    });

    // Reset processing state
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingStep("");
  };

  // Handle AI modal cancel
  const handleAICancel = () => {
    setShowAIModal(false);
  };

  // Handle processing cancel
  const handleProcessingCancel = () => {
    setIsProcessing(false);
    setIsAIFill(false);
    setProcessingProgress(0);
    setProcessingStep("");
  };
  // Handle restart workflow
  const handleRestart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to restart? This will clear all workflow tabs and reset the AI Auto Fill setting."
    );

    if (!confirmed) return;

    // Clear all workflow tabs
    const store = useDocumentsStore.getState();
    workflowTabs.forEach((tab) => {
      store.removeWorkflowTab(tab.id);
    });

    // Reset AI settings
    setIsAIFill(false);
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingStep("");
    setShowAIModal(false);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeWorkflowTab(tabId);
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // Check if this is a file being dragged from documents/forms
    const types = Array.from(e.dataTransfer.types);
    const isFileFromDocuments = types.includes("text/x-document-file");
    const isFileFromForms = types.includes("text/x-form-file");

    console.log(
      "Drag over header - types:",
      types,
      "isFile:",
      isFileFromDocuments || isFileFromForms
    );

    if (isFileFromDocuments || isFileFromForms) {
      e.dataTransfer.dropEffect = "copy";
      setIsDragOverHeader(true);
    } else {
      // This is tab reordering
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverHeader(false);
  };
  const handleDrop = (e: React.DragEvent, targetTabId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverHeader(false);

    console.log("Drop event triggered on header");

    // Check if this is a file from documents/forms
    const types = Array.from(e.dataTransfer.types);
    const isFileFromDocuments = types.includes("text/x-document-file");
    const isFileFromForms = types.includes("text/x-form-file");

    console.log(
      "Drop types:",
      types,
      "isFile:",
      isFileFromDocuments || isFileFromForms
    );

    if (isFileFromDocuments || isFileFromForms) {
      // Handle file drop from documents/forms
      const dragData = e.dataTransfer.getData("application/json");
      console.log("Drag data:", dragData);

      if (dragData) {
        try {
          const { type, fileIndex } = JSON.parse(dragData);
          console.log("Parsed data - type:", type, "fileIndex:", fileIndex);

          // Get the actual file from the store based on type and index
          let actualFile: File | null = null;
          const store = useDocumentsStore.getState();

          if (type === "petitioner") {
            actualFile = store.petitionerFiles[fileIndex];
          } else if (type === "beneficiary") {
            actualFile = store.beneficiaryFiles[fileIndex];
          } else if (type === "form") {
            actualFile = store.formFiles[fileIndex];
          }

          console.log("Found file:", actualFile?.name);

          if (actualFile) {
            store.addWorkflowTab(actualFile, type);
            console.log("Tab added successfully");
          }
        } catch (error) {
          console.error("Error parsing drop data:", error);
        }
      }
      return;
    }

    // Handle tab reordering (only if targetTabId is provided)
    if (targetTabId && draggedTab && draggedTab !== targetTabId) {
      const draggedIndex = workflowTabs.findIndex(
        (tab) => tab.id === draggedTab
      );
      const targetIndex = workflowTabs.findIndex(
        (tab) => tab.id === targetTabId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        reorderWorkflowTabs(draggedIndex, targetIndex);
      }
    }
    setDraggedTab(null);
  };
  return (
    <>
      <div
        className={`bg-slate-100 w-full h-11 flex items-center justify-between transition-colors ${
          isDragOverHeader
            ? "bg-blue-50 border-2 border-dashed border-blue-300"
            : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
      >
        <div className="flex items-center h-full flex-1 min-w-0 overflow-hidden">
          <div className="flex h-full overflow-x-auto scrollbar-hide">
            {workflowTabs.length === 0 ? (
              <div
                className={`flex items-center px-4 py-2 h-full text-sm italic transition-colors ${
                  isDragOverHeader ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {isDragOverHeader
                  ? "Drop files here to create tabs"
                  : "Drag files here to create tabs"}
              </div>
            ) : (
              workflowTabs.map((tab) => (
                <div
                  key={tab.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tab.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tab.id)}
                  onClick={() => setActiveWorkflowTab(tab.id)}
                  className={`group border-r border-gray-300 px-4 py-2 flex items-center gap-2 h-full text-sm font-medium cursor-pointer relative flex-shrink-0 ${
                    activeWorkflowTab === tab.id
                      ? "bg-white text-gray-700"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {/* File type icon */}
                    <span className="text-xs">
                      {tab.file.type.includes("pdf")
                        ? "📄"
                        : tab.file.type.includes("image")
                          ? "🖼️"
                          : "📄"}
                    </span>
                    <span
                      className="select-none whitespace-nowrap max-w-32 truncate"
                      title={tab.name}
                    >
                      {tab.name}
                    </span>
                    {/* Type indicator */}
                    <span
                      className={`text-xs px-1 rounded ${
                        tab.type === "petitioner"
                          ? "bg-blue-100 text-blue-600"
                          : tab.type === "beneficiary"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {tab.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded p-1 transition-opacity duration-150 -mr-1 hover:text-gray-800"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 3L3 9M3 3L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>{" "}
        <div className="flex-shrink-0 ml-3">
          <WorkFlowActions
            isAIFill={isAIFill}
            onAIToggle={handleAIToggle}
            onSubmit={handlePackageSubmit}
            onRestart={handleRestart}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* AI Auto Fill Modal */}
      <AIAutoFillModal
        isOpen={showAIModal}
        onClose={handleAICancel}
        onConfirm={handleAIConfirm}
        fileCount={totalFiles}
      />

      {/* AI Processing Overlay */}
      <AIProcessingOverlay
        isVisible={isProcessing}
        progress={processingProgress}
        currentStep={processingStep}
        onCancel={handleProcessingCancel}
      />
    </>
  );
};

const WorkFlowActions = ({
  isAIFill,
  onAIToggle,
  onSubmit,
  onRestart,
  isSubmitting,
}: {
  isAIFill: boolean;
  onAIToggle: (value: boolean) => void;
  onSubmit: () => void;
  onRestart: () => void;
  isSubmitting: boolean;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <div
          className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
          onClick={() => onAIToggle(!isAIFill)}
          style={{ backgroundColor: isAIFill ? "#10B981" : "#D1D5DB" }}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${
              isAIFill ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
        <span className="ml-3 text-slate-700 text-sm font-medium">
          {isAIFill ? "AI Auto Fill" : "Manual Fill"}
        </span>
      </div>{" "}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onRestart}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-4"
        >
          Restart
        </button>{" "}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`text-white font-semibold py-2.5 px-4 transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            "Submit Package"
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkFlowHeader;
