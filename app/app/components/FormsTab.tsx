import React, { useState } from "react";
import { useDocumentsStore } from "../store/documentsStore";

const FormsTab = () => {
  const { formFiles, addFormFiles, removeFormFile, addWorkflowTab } =
    useDocumentsStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      addFormFiles(pdfFiles);
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
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      addFormFiles(pdfFiles);
    }
  };

  const removeFile = (index: number) => {
    removeFormFile(index);
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isDragOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
      />{" "}
      {formFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p
            className={`text-sm ${
              isDragOver ? "text-blue-600" : "text-slate-500"
            }`}
          >
            {isDragOver
              ? "Drop your PDF files here"
              : "Upload Your Legal Forms Here"}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto  pr-2 space-y-3 py-4">
          {formFiles.map((file, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => {
                console.log("Starting drag for form:", file.name);
                // Set a custom type to identify this as a form file drag
                e.dataTransfer.setData("text/x-form-file", "true");
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({
                    file: {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                    },
                    type: "form",
                    fileIndex: index,
                  })
                );
                e.dataTransfer.effectAllowed = "copy";

                // Create a custom drag image
                const dragDiv = document.createElement("div");
                dragDiv.innerHTML = `📄 ${file.name}`;
                dragDiv.style.cssText =
                  "position: absolute; top: -1000px; padding: 8px; background: #8b5cf6; color: white; border-radius: 4px; font-size: 12px;";
                document.body.appendChild(dragDiv);
                e.dataTransfer.setDragImage(dragDiv, 0, 0);
                setTimeout(() => document.body.removeChild(dragDiv), 0);
              }}
              onDoubleClick={() => {
                addWorkflowTab(file, "form");
              }}
              className="flex items-center justify-between bg-white px-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
              title="Double-click to open in workflow or drag to header"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
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
        <label htmlFor="pdf-upload" className="inline-block">
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            Add PDFs
          </button>
        </label>
      </div>
    </div>
  );
};

export default FormsTab;
