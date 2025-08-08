import React, { useState } from 'react';
import { CreditNote, Invoice } from '../types/invoice';
import { Button, Modal, Badge, Input, TextArea } from './ui';

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
        <Button variant="success" onClick={() => setShowAddForm(true)}>
          Add Credit Note
        </Button>
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
                <Badge 
                  variant={(creditNote.appliedToInvoiceId || creditNote.appliedToInvoice) ? 'success' : 'warning'}
                >
                  {(creditNote.appliedToInvoiceId || creditNote.appliedToInvoice) ? 'Applied' : 'Pending'}
                </Badge>
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
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Credit Note"
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Credit Note Number"
              type="text"
              required
              value={newCreditNote.creditNoteNumber}
              onChange={(e) => setNewCreditNote(prev => ({ ...prev, creditNoteNumber: e.target.value }))}
            />
            <Input
              label="Supplier"
              type="text"
              required
              value={newCreditNote.supplier}
              onChange={(e) => setNewCreditNote(prev => ({ ...prev, supplier: e.target.value }))}
            />
            <Input
              label="Date"
              type="date"
              required
              value={newCreditNote.date}
              onChange={(e) => setNewCreditNote(prev => ({ ...prev, date: e.target.value }))}
            />
            <Input
              label="Total Amount"
              type="number"
              step="0.01"
              required
              value={newCreditNote.amount}
              onChange={(e) => setNewCreditNote(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <TextArea
            label="Reason"
            value={newCreditNote.reason}
            onChange={(e) => setNewCreditNote(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Reason for credit note..."
            className="h-20"
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Items
              </label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddItem}
              >
                + Add Item
              </Button>
            </div>
            {newCreditNote.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                  className="w-32"
                />
                {newCreditNote.items.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
            >
              Add Credit Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreditNoteManager;