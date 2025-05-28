import React, { useState } from "react";
import { useDocumentsStore } from "../store/documentsStore";

const DocumentsTab = () => {
  const {
    petitionerFiles,
    beneficiaryFiles,
    activeDocType,
    addPetitionerFiles,
    addBeneficiaryFiles,
    removePetitionerFile,
    removeBeneficiaryFile,
    setActiveDocType,
    addWorkflowTab,
  } = useDocumentsStore();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );

      if (activeDocType === "petitioner") {
        addPetitionerFiles(validFiles);
      } else {
        addBeneficiaryFiles(validFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );

      if (activeDocType === "petitioner") {
        addPetitionerFiles(validFiles);
      } else {
        addBeneficiaryFiles(validFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    if (activeDocType === "petitioner") {
      removePetitionerFile(index);
    } else {
      removeBeneficiaryFile(index);
    }
  };

  const currentFiles =
    activeDocType === "petitioner" ? petitionerFiles : beneficiaryFiles;

  return (
    <div className="h-full flex flex-col">
      {/* Document Type Selector */}
      <div className="flex-shrink-0 py-2 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setActiveDocType("petitioner")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDocType === "petitioner"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Petitioner
          </button>
          <button
            onClick={() => setActiveDocType("beneficiary")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDocType === "beneficiary"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Beneficiary
          </button>
        </div>
      </div>

      {/* Drop Area and File List */}
      <div
        className={`flex-1 flex flex-col pl-2 ${
          isDragOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="document-upload"
        />

        {currentFiles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p
              className={`text-sm ${
                isDragOver ? "text-blue-600" : "text-slate-500"
              }`}
            >
              {isDragOver
                ? "Drop your files here"
                : `Upload ${
                    activeDocType === "petitioner"
                      ? "Petitioner"
                      : "Beneficiary"
                  } Documents Here`}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 py-4">
            {currentFiles.map((file, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => {
                  console.log(
                    "Starting drag for document:",
                    file.name,
                    "type:",
                    activeDocType
                  );
                  // Set a custom type to identify this as a document file drag
                  e.dataTransfer.setData("text/x-document-file", "true");
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({
                      file: {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                      },
                      type: activeDocType,
                      fileIndex: index,
                    })
                  );
                  e.dataTransfer.effectAllowed = "copy";

                  // Create a custom drag image
                  const dragDiv = document.createElement("div");
                  dragDiv.innerHTML = `📄 ${file.name}`;
                  dragDiv.style.cssText =
                    "position: absolute; top: -1000px; padding: 8px; background: #3b82f6; color: white; border-radius: 4px; font-size: 12px;";
                  document.body.appendChild(dragDiv);
                  e.dataTransfer.setDragImage(dragDiv, 0, 0);
                  setTimeout(() => document.body.removeChild(dragDiv), 0);
                }}
                onClick={() => {
                  addWorkflowTab(file, activeDocType);
                }}
                onDoubleClick={() => {
                  addWorkflowTab(file, activeDocType);
                }}
                className="flex items-center justify-between bg-white px-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                title="Double-click to open in workflow or drag to header"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-slate-400">
                    {file.type.startsWith("image/") ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm text-slate-700 font-medium truncate flex-1"
                    title={file.name}
                  >
                    {file.name.length > 40
                      ? `${file.name.substring(0, 40)}...`
                      : file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex-shrink-0 py-2 text-center border-t border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
          <label htmlFor="document-upload" className="inline-block">
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() =>
                document.getElementById("document-upload")?.click()
              }
            >
              Add Files
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
