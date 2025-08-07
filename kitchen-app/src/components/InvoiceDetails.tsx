import React, { useState } from 'react';
import { Invoice, InvoiceItem, DamageReport } from '../types/invoice';
import DamageReportDialog from './DamageReportDialog';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onUpdateItem: (itemId: string, updates: Partial<InvoiceItem>) => void;
  onEdit: (invoice: Invoice) => void;
  onClose: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ 
  invoice, 
  onUpdateItem,
  onEdit, 
  onClose 
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [damageReportItem, setDamageReportItem] = useState<InvoiceItem | null>(null);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const markSelectedAsDelivered = () => {
    selectedItems.forEach(itemId => {
      onUpdateItem(itemId, { 
        delivered: true, 
        deliveryDate: new Date() 
      });
    });
    setSelectedItems([]);
  };

  const toggleItemDelivery = (item: InvoiceItem) => {
    onUpdateItem(item.id, {
      delivered: !item.delivered,
      deliveryDate: !item.delivered ? new Date() : undefined
    });
  };

  const handleDamageReport = (itemId: string, damageReport: DamageReport) => {
    onUpdateItem(itemId, { damageReport });
    setDamageReportItem(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Invoice {invoice.invoiceNumber}
              </h2>
              <p className="text-gray-600">{invoice.supplier}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(invoice)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Invoice</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Date:</span>
                <span className="ml-2">{new Date(invoice.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <span className="ml-2 capitalize">{invoice.status.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="ml-2">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tax:</span>
                <span className="ml-2">${invoice.tax.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Total:</span>
                <span className="ml-2 font-medium">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item(s) selected
                </span>
                <button
                  onClick={markSelectedAsDelivered}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 ${
                  item.delivered ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.description}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span>Unit: ${item.unitPrice.toFixed(2)}</span>
                        <span>Total: ${item.totalPrice.toFixed(2)}</span>
                      </div>
                      {item.delivered && item.deliveryDate && (
                        <p className="text-sm text-green-600 mt-1 font-medium">
                          ✓ Delivered on {new Date(item.deliveryDate).toLocaleDateString()}
                        </p>
                      )}
                      {item.creditNoteApplied && (
                        <p className="text-sm text-blue-600 mt-1">
                          Credit note applied: ${item.creditNoteAmount?.toFixed(2)}
                        </p>
                      )}
                      {item.damageReport?.reported && (
                        <div className="text-sm text-red-600 mt-1">
                          <p className="font-medium flex items-center">
                            🚨 Damage Reported 
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              item.damageReport.severity === 'total_loss' ? 'bg-red-100 text-red-800' :
                              item.damageReport.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.damageReport.severity === 'total_loss' ? 'Total Loss' : 
                               item.damageReport.severity ? item.damageReport.severity.charAt(0).toUpperCase() + item.damageReport.severity.slice(1) : 'Unknown'}
                            </span>
                          </p>
                          {item.damageReport.reason && (
                            <p className="text-xs mt-1 text-red-500">
                              {item.damageReport.reason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleItemDelivery(item)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        item.delivered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.delivered ? 'Delivered' : 'Mark Delivered'}
                    </button>
                    <button
                      onClick={() => setDamageReportItem(item)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        item.damageReport?.reported
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      {item.damageReport?.reported ? 'View Damage' : 'Report Damage'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {invoice.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Damage Report Dialog */}
      {damageReportItem && (
        <DamageReportDialog
          item={damageReportItem}
          onSave={handleDamageReport}
          onCancel={() => setDamageReportItem(null)}
        />
      )}
    </div>
  );
};

export default InvoiceDetails;