import React from 'react';
import { Invoice } from '../types/invoice';
import { Card, Button, Badge, EditIcon } from './ui';
import { getStatusColor, formatStatusText } from '../utils/statusUtils';
import { formatDate, formatCurrency } from '../utils/formatUtils';

interface InvoiceCardProps {
  invoice: Invoice;
  onViewDetails: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onViewDetails, onEdit }) => {

  const deliveredItems = invoice.items.filter(item => item.delivered).length;
  const totalItems = invoice.items.length;

  return (
    <Card hover={true}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-sm text-gray-600">{invoice.supplier}</p>
        </div>
        <Badge variant={invoice.status === 'fully_delivered' ? 'success' : invoice.status === 'partially_delivered' ? 'warning' : 'info'}>
          {formatStatusText(invoice.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Date:</span>
          <span className="ml-2 text-gray-900">{formatDate(invoice.date)}</span>
        </div>
        <div>
          <span className="text-gray-500">Total:</span>
          <span className="ml-2 text-gray-900 font-medium">{formatCurrency(invoice.total)}</span>
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(invoice)}
            className="whitespace-nowrap flex items-center space-x-1"
          >
            <EditIcon />
            <span>Edit</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(invoice)}
            className="whitespace-nowrap"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceCard;