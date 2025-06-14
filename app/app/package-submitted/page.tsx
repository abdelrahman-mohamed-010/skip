"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Clock, FileText } from "lucide-react";

function PackageSubmittedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get submission details from URL params
  const confirmationNumber = searchParams.get("confirmation");
  const packageType = searchParams.get("type") || "Immigration Package";
  const fileCount = searchParams.get("files") || "0";

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 ">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Success Header - Perfectly Centered */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-60"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Submission Complete
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Your {packageType} with {fileCount} files has been successfully
            submitted
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Card - Submission Details */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Submission Details
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {confirmationNumber && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-30"></div>
                    <p className="text-sm font-medium text-green-700 mb-2">
                      Confirmation Number
                    </p>
                    <p className="font-mono text-xl font-bold text-green-800 tracking-wider">
                      {confirmationNumber}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Package Type
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {packageType}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Files Submitted
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {fileCount} files
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Processing Info */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Processing Timeline
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-700">
                        Average processing time:
                      </span>{" "}
                      11.5 months
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-700">
                        Typical range:
                      </span>{" "}
                      10-14 months
                    </p>
                    <p className="text-sm text-gray-600">
                      For expedited processing, consult our attorneys.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Resources
                    </h4>
                    <a
                      href="https://egov.uscis.gov/processing-times/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                    >
                      Check USCIS Processing Times
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Need help?</span> Contact
                      our support team:
                    </p>
                    <a
                      href="mailto:support@skiplegal.com"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      support@skiplegal.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Perfectly Centered */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <button
            onClick={() => router.push("/app")}
            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="relative z-10">Start New Package</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PackageSubmittedPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PackageSubmittedContent />
    </Suspense>
  );
}
