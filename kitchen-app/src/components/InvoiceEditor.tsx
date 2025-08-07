import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '../types/invoice';

interface InvoiceEditorProps {
  invoice: Invoice;
  onSave: (updatedInvoice: Invoice) => void;
  onCancel: () => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: invoice.invoiceNumber,
    supplier: invoice.supplier,
    supplierAddress: invoice.supplierAddress || '',
    date: invoice.date.toISOString().split('T')[0],
    dueDate: invoice.dueDate ? invoice.dueDate.toISOString().split('T')[0] : '',
    subtotal: invoice.subtotal.toString(),
    tax: invoice.tax.toString(),
    total: invoice.total.toString(),
    notes: invoice.notes || ''
  });

  const [items, setItems] = useState<InvoiceItem[]>(invoice.items);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (isNaN(parseFloat(formData.subtotal)) || parseFloat(formData.subtotal) < 0) {
      newErrors.subtotal = 'Valid subtotal is required';
    }
    if (isNaN(parseFloat(formData.tax)) || parseFloat(formData.tax) < 0) {
      newErrors.tax = 'Valid tax amount is required';
    }
    if (isNaN(parseFloat(formData.total)) || parseFloat(formData.total) < 0) {
      newErrors.total = 'Valid total is required';
    }

    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number | boolean) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total price when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Clear related errors
    const errorKey = `item_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      delivered: false
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceNumber: formData.invoiceNumber,
      supplier: formData.supplier,
      supplierAddress: formData.supplierAddress || undefined,
      date: new Date(formData.date),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      subtotal: parseFloat(formData.subtotal),
      tax: parseFloat(formData.tax),
      total: parseFloat(formData.total),
      items: items,
      notes: formData.notes || undefined
    };

    onSave(updatedInvoice);
  };

  // Auto-calculate totals when items change
  useEffect(() => {
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const calculatedTotal = calculatedSubtotal + parseFloat(formData.tax || '0');
    
    setFormData(prev => ({
      ...prev,
      subtotal: calculatedSubtotal.toFixed(2),
      total: calculatedTotal.toFixed(2)
    }));
  }, [items, formData.tax]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Edit Invoice</h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.supplier ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.supplier && (
                <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Address
            </label>
            <textarea
              value={formData.supplierAddress}
              onChange={(e) => handleInputChange('supplierAddress', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Supplier address..."
            />
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Item description"
                      />
                      {errors[`item_${index}_description`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-full border rounded px-2 py-1 text-sm ${
                          errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <input
                        type="text"
                        value={`$${item.totalPrice.toFixed(2)}`}
                        readOnly
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={item.delivered}
                        onChange={(e) => handleItemChange(index, 'delivered', e.target.checked)}
                        className="mr-2"
                      />
                      Delivered
                      {item.delivered && item.deliveryDate && (
                        <span className="ml-2 text-xs text-gray-500">
                          on {new Date(item.deliveryDate).toLocaleDateString()}
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtotal *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => handleInputChange('subtotal', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.subtotal ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.subtotal && (
                <p className="text-red-500 text-xs mt-1">{errors.subtotal}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) => handleInputChange('tax', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.tax ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tax && (
                <p className="text-red-500 text-xs mt-1">{errors.tax}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => handleInputChange('total', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.total ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.total && (
                <p className="text-red-500 text-xs mt-1">{errors.total}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEditor;