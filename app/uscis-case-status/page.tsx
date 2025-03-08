"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

type HistoricalStatus = {
  date: string;
  completed_text_en: string;
  completed_text_es: string;
};

type CaseStatus = {
  case_status: {
    receiptNumber: string;
    formType: string;
    submittedDate: string;
    current_case_status_text_en: string;
    current_case_status_desc_en: string;
    hist_case_status: HistoricalStatus[] | null;
  };
  message: string;
};

export default function ImmigrationCaseStatus() {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [caseStatus, setCaseStatus] = useState<CaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCaseStatus(null);

    try {
      const response = await fetch(
        `/api/case-status?receiptNumber=${receiptNumber}`
      );
      const data = await response.json();

      console.log("API Response:", data);
      console.log("Historical Data:", data.case_status?.hist_case_status);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch case status");
      }

      setCaseStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseStatus) {
      console.log("Case Status State:", caseStatus);
      console.log(
        "Historical Data in State:",
        caseStatus.case_status.hist_case_status
      );
    }
  }, [caseStatus]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          USCIS Case Status Checker
        </h1>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Enter your receipt number (e.g., EAC9999103402)"
            />
          </div>
          <button
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading || !receiptNumber ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading || !receiptNumber}
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {error && (
          <div className="max-w-md mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {caseStatus && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-md border p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {/* Current Status Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                  <div className="space-y-4">
                    <div>
                      <strong>Receipt Number:</strong>{" "}
                      {caseStatus.case_status.receiptNumber}
                    </div>
                    <hr className="border-t border-gray-200 my-2" />
                    <div>
                      <strong>Form Type:</strong>{" "}
                      {caseStatus.case_status.formType}
                    </div>
                    <hr className="border-t border-gray-200 my-2" />
                    <div>
                      <strong>Submitted Date:</strong>{" "}
                      {formatDate(caseStatus.case_status.submittedDate)}
                    </div>
                    <hr className="border-t border-gray-200 my-2" />
                    <div>
                      <strong>Current Status:</strong>{" "}
                      {caseStatus.case_status.current_case_status_text_en}
                    </div>
                    <hr className="border-t border-gray-200 my-2" />
                    <div>
                      <strong>Details:</strong>{" "}
                      <div
                        className="mt-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            caseStatus.case_status.current_case_status_desc_en,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Historical Status Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Case History</h2>
                  <div className="space-y-4">
                    {Array.isArray(caseStatus.case_status.hist_case_status) &&
                    caseStatus.case_status.hist_case_status.length > 0 ? (
                      caseStatus.case_status.hist_case_status.map(
                        (history, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-600">
                                {formatDate(history.date)}
                              </span>
                            </div>
                            <div className="text-gray-700">
                              {history.completed_text_en}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        No historical status data available for this case.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{" "}
    </>
  );
}
