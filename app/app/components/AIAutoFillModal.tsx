"use client";

import React from "react";
import { X, Bot, FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface AIAutoFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileCount: number;
}

const AIAutoFillModal: React.FC<AIAutoFillModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileCount,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />{" "}
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI Auto Fill Confirmation
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enable intelligent form filling
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">
                      Documents to Process
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {fileCount} document{fileCount !== 1 ? "s" : ""} will be
                      analyzed and forms will be automatically filled based on
                      the extracted information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">
                      What AI Will Do
                    </h3>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>
                        • Extract relevant information from your documents
                      </li>
                      <li>• Automatically populate form fields</li>
                      <li>• Ensure data consistency across forms</li>
                      <li>• Flag any missing or unclear information</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-900">
                      Please Review
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Always review the auto-filled information for accuracy
                      before submission. You can edit any field as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Start AI Auto Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAutoFillModal;
