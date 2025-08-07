import React from 'react';
import { Invoice } from '../types/invoice';

interface InvoiceCardProps {
  invoice: Invoice;
  onViewDetails: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onViewDetails, onEdit }) => {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'fully_delivered':
        return 'bg-green-100 text-green-800';
      case 'partially_delivered':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const deliveredItems = invoice.items.filter(item => item.delivered).length;
  const totalItems = invoice.items.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-sm text-gray-600">{invoice.supplier}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
          {invoice.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Date:</span>
          <span className="ml-2 text-gray-900">{formatDate(invoice.date)}</span>
        </div>
        <div>
          <span className="text-gray-500">Total:</span>
          <span className="ml-2 text-gray-900 font-medium">${invoice.total.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-500">Items:</span>
          <span className="ml-2 text-gray-900">{totalItems}</span>
        </div>
        <div>
          <span className="text-gray-500">Delivered:</span>
          <span className="ml-2 text-gray-900">{deliveredItems}/{totalItems}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(deliveredItems / totalItems) * 100}%` }}
          ></div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(invoice)}
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm whitespace-nowrap flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
          <button
            onClick={() => onViewDetails(invoice)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;