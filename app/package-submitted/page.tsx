"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PackageSubmittedPage() {
  const router = useRouter();
  const [submissionDetails, setSubmissionDetails] = useState({
    confirmationNumber: "",
    submittedAt: "",
    packageType: "",
  });

  useEffect(() => {
    // Get submission details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const confirmationNumber =
      urlParams.get("confirmation") || `PKG-${Date.now()}`;
    const packageType = urlParams.get("type") || "Immigration Package";

    setSubmissionDetails({
      confirmationNumber,
      submittedAt: new Date().toLocaleString(),
      packageType,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Package Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Your {submissionDetails.packageType} has been submitted and is
              being processed.
            </p>
          </div>

          {/* Submission Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              Submission Details
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confirmation Number:</span>
                <span className="font-medium text-gray-900">
                  {submissionDetails.confirmationNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium text-gray-900">
                  {submissionDetails.submittedAt}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Package Type:</span>
                <span className="font-medium text-gray-900">
                  {submissionDetails.packageType}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              What happens next?
            </h3>{" "}
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • We&apos;ll review your submitted package within 24-48 hours
              </li>
              <li>• You&apos;ll receive an email confirmation shortly</li>
              <li>
                • Our team will contact you if any additional information is
                needed
              </li>
              <li>• Track your progress using your confirmation number</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/app")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Package
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </button>
          </div>

          {/* Contact Support */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@skiplegal.com"
                className="text-blue-600 hover:text-blue-500"
              >
                support@skiplegal.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
