"use client";

import { useState } from "react";

interface PdfViewerProps {
  pdfUrl: string;
}

const PdfViewer = ({ pdfUrl }: PdfViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full aspect-[4/3] relative flex flex-col items-end justify-end">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <iframe
        src={`${pdfUrl}#view=FitH`}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title="PDF Viewer"
      />
      <button
        onClick={handleDownload}
        className="bg-primary text-white p-3 px-6 font-bold rounded-full mt-9"
      >
        Download
      </button>
    </div>
  );
};

export default PdfViewer;
