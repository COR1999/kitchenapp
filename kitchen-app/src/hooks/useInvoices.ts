import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, ScanResult, CreditNote } from '../types/invoice';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load invoices from localStorage on mount
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        setInvoices(parsed.map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date),
          dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
          scannedAt: new Date(invoice.scannedAt),
          items: invoice.items.map((item: any) => ({
            ...item,
            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : undefined
          }))
        })));
      } catch (error) {
        console.error('Failed to load invoices from localStorage:', error);
      }
    }

    // Load credit notes from localStorage
    const savedCreditNotes = localStorage.getItem('creditNotes');
    if (savedCreditNotes) {
      try {
        const parsed = JSON.parse(savedCreditNotes);
        setCreditNotes(parsed.map((creditNote: any) => ({
          ...creditNote,
          date: new Date(creditNote.date)
        })));
      } catch (error) {
        console.error('Failed to load credit notes from localStorage:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    localStorage.setItem('invoices', JSON.stringify(newInvoices));
    setInvoices(newInvoices);
  };

  const saveCreditNotes = (newCreditNotes: CreditNote[]) => {
    localStorage.setItem('creditNotes', JSON.stringify(newCreditNotes));
    setCreditNotes(newCreditNotes);
  };

  const addInvoice = (scanResult: ScanResult, imageFile: File) => {
    if (!scanResult.success || !scanResult.invoice) {
      throw new Error(scanResult.error || 'Failed to process invoice');
    }

    // Create image URL (in a real app, you'd upload to a server/cloud storage)
    const imageUrl = URL.createObjectURL(imageFile);

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: scanResult.invoice.invoiceNumber || `INV-${Date.now()}`,
      supplier: scanResult.invoice.supplier || 'Unknown Supplier',
      date: scanResult.invoice.date || new Date(),
      dueDate: scanResult.invoice.dueDate,
      subtotal: scanResult.invoice.subtotal || 0,
      tax: scanResult.invoice.tax || 0,
      total: scanResult.invoice.total || 0,
      items: scanResult.invoice.items?.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random().toString(),
        delivered: false
      })) || [],
      imageUrl,
      scannedAt: new Date(),
      status: 'pending',
      notes: `Scanned with ${(scanResult.confidence * 100).toFixed(1)}% confidence`
    };

    updateInvoiceStatus(newInvoice);
    const updatedInvoices = [newInvoice, ...invoices];
    saveInvoices(updatedInvoices);
  };

  const updateInvoiceStatus = (invoice: Invoice) => {
    const deliveredItems = invoice.items.filter(item => item.delivered).length;
    const totalItems = invoice.items.length;

    if (deliveredItems === 0) {
      invoice.status = 'pending';
    } else if (deliveredItems === totalItems) {
      invoice.status = 'fully_delivered';
    } else {
      invoice.status = 'partially_delivered';
    }

    // Check if overdue
    if (invoice.dueDate && new Date() > invoice.dueDate && invoice.status !== 'fully_delivered') {
      invoice.status = 'overdue';
    }
  };

  const updateInvoiceItem = (invoiceId: string, itemId: string, updates: Partial<InvoiceItem>) => {
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        const updatedItems = invoice.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        const updatedInvoice = { ...invoice, items: updatedItems };
        updateInvoiceStatus(updatedInvoice);
        return updatedInvoice;
      }
      return invoice;
    });
    
    saveInvoices(updatedInvoices);
  };

  const deleteInvoice = (invoiceId: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
    saveInvoices(updatedInvoices);
  };

  const getInvoiceStats = () => {
    const total = invoices.length;
    const pending = invoices.filter(inv => inv.status === 'pending').length;
    const partiallyDelivered = invoices.filter(inv => inv.status === 'partially_delivered').length;
    const fullyDelivered = invoices.filter(inv => inv.status === 'fully_delivered').length;
    const overdue = invoices.filter(inv => inv.status === 'overdue').length;
    const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);

    return {
      total,
      pending,
      partiallyDelivered,
      fullyDelivered,
      overdue,
      totalValue
    };
  };

  const addCreditNote = (creditNote: Omit<CreditNote, 'id'>) => {
    const newCreditNote: CreditNote = {
      ...creditNote,
      id: Date.now().toString()
    };
    const updatedCreditNotes = [newCreditNote, ...creditNotes];
    saveCreditNotes(updatedCreditNotes);
  };

  const applyCreditNoteToInvoice = (creditNoteId: string, invoiceId: string) => {
    // Update credit note
    const updatedCreditNotes = creditNotes.map(cn => 
      cn.id === creditNoteId 
        ? { ...cn, appliedToInvoice: true, relatedInvoiceId: invoiceId }
        : cn
    );
    saveCreditNotes(updatedCreditNotes);

    // Update invoice items with credit note information
    const creditNote = creditNotes.find(cn => cn.id === creditNoteId);
    if (creditNote) {
      const updatedInvoices = invoices.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedItems = invoice.items.map(item => ({
            ...item,
            creditNoteApplied: true,
            creditNoteAmount: creditNote.amount / invoice.items.length // Simple distribution
          }));
          return { ...invoice, items: updatedItems };
        }
        return invoice;
      });
      saveInvoices(updatedInvoices);
    }
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    );
    
    // Update the status based on delivery status
    updateInvoiceStatus(updatedInvoice);
    
    saveInvoices(updatedInvoices);
  };

  return {
    invoices,
    creditNotes,
    loading,
    addInvoice,
    updateInvoice,
    updateInvoiceItem,
    deleteInvoice,
    getInvoiceStats,
    addCreditNote,
    applyCreditNoteToInvoice
  };
};