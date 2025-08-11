import React from 'react';
import { DuplicateInvoice, ScanResult } from '../types/invoice';

interface DuplicateInvoiceModalProps {
  isOpen: boolean;
  duplicates: DuplicateInvoice[];
  scanResult: ScanResult;
  onProceedAnyway: () => void;
  onCancel: () => void;
  onViewExisting: (invoiceId: string) => void;
}

const DuplicateInvoiceModal: React.FC<DuplicateInvoiceModalProps> = ({
  isOpen,
  duplicates,
  scanResult,
  onProceedAnyway,
  onCancel,
  onViewExisting
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Possible Duplicate Invoice</h3>
              <p className="text-sm text-gray-500">We found similar invoices already in your system</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">New Invoice Details:</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Invoice #:</span> {scanResult.invoice?.invoiceNumber || 'N/A'}</div>
                <div><span className="font-medium">Supplier:</span> {scanResult.invoice?.supplier || 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {scanResult.invoice?.date ? formatDate(scanResult.invoice.date) : 'N/A'}</div>
                <div><span className="font-medium">Total:</span> {scanResult.invoice?.total ? formatCurrency(scanResult.invoice.total) : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Similar Invoices Found:</h4>
            <div className="space-y-3">
              {duplicates.map((duplicate) => (
                <div key={duplicate.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          duplicate.matchType === 'exact' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {duplicate.matchType === 'exact' ? 'Exact Match' : `${duplicate.matchScore}% Match`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><span className="font-medium">Invoice #:</span> {duplicate.invoiceNumber}</div>
                        <div><span className="font-medium">Supplier:</span> {duplicate.supplier}</div>
                        <div><span className="font-medium">Date:</span> {formatDate(duplicate.date)}</div>
                        <div><span className="font-medium">Total:</span> {formatCurrency(duplicate.total)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewExisting(duplicate.id)}
                      className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel Scan
            </button>
            <button
              onClick={onProceedAnyway}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Save Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateInvoiceModal;