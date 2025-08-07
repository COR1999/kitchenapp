import React from 'react';
import { DuplicateCheckResult } from '../services/duplicateDetectionService';
import { ScanResult } from '../types/invoice';

interface DuplicateInvoiceDialogProps {
  scanResult: ScanResult;
  duplicateResult: DuplicateCheckResult;
  onProceedAnyway: () => void;
  onSkip: () => void;
  onViewExisting: (invoiceId: string) => void;
  onCancel: () => void;
}

const DuplicateInvoiceDialog: React.FC<DuplicateInvoiceDialogProps> = ({
  scanResult,
  duplicateResult,
  onProceedAnyway,
  onSkip,
  onViewExisting,
  onCancel
}) => {
  const topMatch = duplicateResult.matches[0];
  const confidenceColor = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const confidenceIcon = {
    high: '🚨',
    medium: '⚠️',
    low: 'ℹ️'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{confidenceIcon[duplicateResult.confidence]}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Possible Duplicate Invoice Detected
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  This invoice may already exist in your system
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Confidence Level */}
          <div className={`p-4 rounded-lg border ${confidenceColor[duplicateResult.confidence]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium capitalize">{duplicateResult.confidence} Confidence Match</span>
              <span className="text-sm font-mono">
                {Math.round(topMatch.matchScore * 100)}% similarity
              </span>
            </div>
            <p className="text-sm">
              {duplicateResult.confidence === 'high' && 
                "This appears to be a duplicate of an existing invoice. Proceeding will create a duplicate entry."}
              {duplicateResult.confidence === 'medium' && 
                "This invoice is similar to an existing one. Please review before proceeding."}
              {duplicateResult.confidence === 'low' && 
                "This invoice has some similarities to existing invoices but is likely unique."}
            </p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scanned Invoice */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Scanned Invoice</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Invoice Number:</span>
                  <span className="ml-2 font-medium">
                    {scanResult.invoice?.invoiceNumber || 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Supplier:</span>
                  <span className="ml-2 font-medium">
                    {scanResult.invoice?.supplier || 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium">
                    {scanResult.invoice?.date?.toLocaleDateString() || 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-medium">
                    {scanResult.invoice?.total ? `$${scanResult.invoice.total.toFixed(2)}` : 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">OCR Confidence:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(scanResult.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Existing Invoice */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Existing Invoice</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Invoice Number:</span>
                  <span className="ml-2 font-medium">{topMatch.existingInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Supplier:</span>
                  <span className="ml-2 font-medium">{topMatch.existingInvoice.supplier}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium">{topMatch.existingInvoice.date.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-medium">${topMatch.existingInvoice.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    topMatch.existingInvoice.status === 'fully_delivered' 
                      ? 'bg-green-100 text-green-800'
                      : topMatch.existingInvoice.status === 'partially_delivered'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {topMatch.existingInvoice.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Reasons */}
          {topMatch.matchReasons.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Similarity Details:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {topMatch.matchReasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Matches */}
          {duplicateResult.matches.length > 1 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {duplicateResult.matches.length - 1} Other Similar Invoice{duplicateResult.matches.length > 2 ? 's' : ''}:
              </h4>
              <div className="space-y-2">
                {duplicateResult.matches.slice(1, 4).map((match, index) => (
                  <div key={index} className="text-sm text-gray-600 flex justify-between">
                    <span>{match.existingInvoice.invoiceNumber} - {match.existingInvoice.supplier}</span>
                    <span>{Math.round(match.matchScore * 100)}% match</span>
                  </div>
                ))}
                {duplicateResult.matches.length > 4 && (
                  <div className="text-sm text-gray-500">
                    ...and {duplicateResult.matches.length - 4} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel Scan
            </button>
            
            <button
              onClick={() => onViewExisting(topMatch.existingInvoice.id)}
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
            >
              View Existing Invoice
            </button>
            
            <button
              onClick={onSkip}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Skip This Scan
            </button>
            
            <button
              onClick={onProceedAnyway}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                duplicateResult.confidence === 'high'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {duplicateResult.confidence === 'high' 
                ? 'Create Duplicate Anyway' 
                : 'Proceed with New Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateInvoiceDialog;