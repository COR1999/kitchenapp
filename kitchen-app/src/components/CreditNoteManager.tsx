import React, { useState } from 'react';
import { CreditNote, Invoice } from '../types/invoice';

interface CreditNoteManagerProps {
  creditNotes: CreditNote[];
  invoices: Invoice[];
  onApplyCreditNote: (creditNoteId: string, invoiceId: string) => void;
  onAddCreditNote: (creditNote: Omit<CreditNote, 'id'>) => void;
}

const CreditNoteManager: React.FC<CreditNoteManagerProps> = ({
  creditNotes,
  invoices,
  onApplyCreditNote,
  onAddCreditNote
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCreditNote, setNewCreditNote] = useState({
    creditNoteNumber: '',
    supplier: '',
    date: '',
    amount: '',
    reason: '',
    relatedInvoiceId: '',
    items: [{ description: '', amount: '' }]
  });

  const handleAddItem = () => {
    setNewCreditNote(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '' }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setNewCreditNote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    setNewCreditNote(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const creditNote: Omit<CreditNote, 'id'> = {
      creditNoteNumber: newCreditNote.creditNoteNumber,
      supplier: newCreditNote.supplier,
      date: new Date(newCreditNote.date),
      totalAmount: parseFloat(newCreditNote.amount),
      reason: newCreditNote.reason,
      relatedInvoiceId: newCreditNote.relatedInvoiceId || undefined,
      items: newCreditNote.items
        .filter(item => item.description && item.amount)
        .map(item => ({
          description: item.description,
          amount: parseFloat(item.amount)
        })),
      appliedToInvoiceId: undefined
    };

    onAddCreditNote(creditNote);
    setShowAddForm(false);
    setNewCreditNote({
      creditNoteNumber: '',
      supplier: '',
      date: '',
      amount: '',
      reason: '',
      relatedInvoiceId: '',
      items: [{ description: '', amount: '' }]
    });
  };

  const unappliedCreditNotes = creditNotes.filter(cn => !cn.appliedToInvoiceId && !cn.appliedToInvoice);
  const matchableInvoices = invoices.filter(inv => inv.status !== 'fully_delivered');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Credit Notes</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add Credit Note
        </button>
      </div>

      {/* Unapplied Credit Notes */}
      {unappliedCreditNotes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-3">Unapplied Credit Notes</h3>
          <div className="space-y-3">
            {unappliedCreditNotes.map((creditNote) => (
              <div key={creditNote.id} className="bg-white rounded border p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{creditNote.creditNoteNumber}</div>
                    <div className="text-sm text-gray-600">
                      {creditNote.supplier} • ${(creditNote.totalAmount || creditNote.amount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(creditNote.date).toLocaleDateString()}
                    </div>
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onApplyCreditNote(creditNote.id, e.target.value);
                      }
                    }}
                    className="text-sm border rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Apply to Invoice</option>
                    {matchableInvoices
                      .filter(inv => inv.supplier === creditNote.supplier)
                      .map(invoice => (
                        <option key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber} (${invoice.total.toFixed(2)})
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Reason:</strong> {creditNote.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applied Credit Notes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-gray-900">All Credit Notes</h3>
        </div>
        <div className="divide-y">
          {creditNotes.map((creditNote) => (
            <div key={creditNote.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{creditNote.creditNoteNumber}</div>
                  <div className="text-sm text-gray-600">
                    {creditNote.supplier} • ${(creditNote.totalAmount || creditNote.amount || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(creditNote.date).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  (creditNote.appliedToInvoiceId || creditNote.appliedToInvoice)
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {(creditNote.appliedToInvoiceId || creditNote.appliedToInvoice) ? 'Applied' : 'Pending'}
                </div>
              </div>
              {(creditNote.appliedToInvoiceId || creditNote.relatedInvoiceId) && (
                <div className="text-sm text-blue-600 mt-1">
                  Applied to: {invoices.find(inv => inv.id === (creditNote.appliedToInvoiceId || creditNote.relatedInvoiceId))?.invoiceNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Credit Note Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Add Credit Note</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Note Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCreditNote.creditNoteNumber}
                    onChange={(e) => setNewCreditNote(prev => ({ ...prev, creditNoteNumber: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCreditNote.supplier}
                    onChange={(e) => setNewCreditNote(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newCreditNote.date}
                    onChange={(e) => setNewCreditNote(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCreditNote.amount}
                    onChange={(e) => setNewCreditNote(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={newCreditNote.reason}
                  onChange={(e) => setNewCreditNote(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 h-20"
                  placeholder="Reason for credit note..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                {newCreditNote.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                      className="w-32 border rounded-md px-3 py-2"
                    />
                    {newCreditNote.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-600 px-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditNoteManager;