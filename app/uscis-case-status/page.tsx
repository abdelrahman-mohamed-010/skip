"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import { Bell, Check, Mail, RefreshCw, ChevronRight, AlertCircle } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCaseStatus(null);

    try {
      const response = await fetch(
        `/api/case-status?receiptNumber=${receiptNumber}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to fetch case status. Please make sure you have the correct receipt number`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      console.log("Historical Data:", data.case_status?.hist_case_status);
      
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

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError('Please enter a valid email address');
      return;
    }
    if (!caseStatus?.case_status.receiptNumber) {
      setSubscribeError('Cannot subscribe without a valid case check first.');
      return;
    }

    setSubscribeLoading(true);
    setSubscribeError('');

    try {
      // Replace with actual API call to /api/subscribe
      console.log('Subscribing:', email, caseStatus.case_status.receiptNumber);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     email,
      //     receiptNumber: caseStatus.case_status.receiptNumber
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to subscribe.');
      // }
      setSubscribed(true);
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Failed to subscribe.');
    } finally {
      setSubscribeLoading(false);
    }
  };

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
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          USCIS Case Status Checker
        </h1>

        <form 
          name="uscis-case-status-form"
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto mb-8"
        >
          <div className="mb-4">
            <input
              type="text"
              className="w-full text-primary p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Email Notification Form/Confirmation - MOVED HERE */} 
        {caseStatus && (
          !subscribed ? (
            <div className="max-w-2xl mx-auto mt-8 border-2 border-yellow-400 rounded-lg overflow-hidden bg-yellow-100 p-4 shadow-lg transition-opacity duration-500 ease-in-out animate-fadeIn">
              <div className="flex items-start mb-3">
                <Bell className="h-6 w-6 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg text-yellow-800">Get Status Updates</h4>
                  <p className="text-sm text-gray-700">
                    We'll notify you when your case status changes
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-primary"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                  onClick={handleSubscribe}
                  disabled={subscribeLoading}
                >
                  {subscribeLoading ? (
                    <RefreshCw className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-1" /> Stay Informed
                    </>
                  )}
                </button>
              </div>
              {subscribeError && (
                <div className="mt-3 text-red-600 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {subscribeError}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto mt-8 border border-green-200 rounded-lg overflow-hidden bg-green-50 p-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Subscription Confirmed!</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive email notifications for receipt number {caseStatus?.case_status.receiptNumber} at {email}.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {caseStatus && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="rounded-md border p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {/* Current Status Section */}
                <div className="bg-blue-50 p-4 rounded-lg text-primary">
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

            {/* Information Box - MOVED HERE */} 
            <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                  <span>We'll send you updates when your case status changes (if subscribed).</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                  <span>You can check back anytime with your receipt number.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                  <span>If you have questions about your case, contact USCIS directly.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>{" "}
    </>
  );
}
