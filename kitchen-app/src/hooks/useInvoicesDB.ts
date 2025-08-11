import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, ScanResult, CreditNote, DuplicateCheckResult } from '../types/invoice';
import BrowserDatabase from '../database/browserDB';
import { dummyInvoices, dummyCreditNotes } from '../data/dummyData';
import { lastMonthInvoices, lastMonthCreditNotes } from '../data/lastMonthData';
import { augustInvoices, augustCreditNotes } from '../data/augustData';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Database instance
  const db = BrowserDatabase.getInstance();

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setLoading(true);

      // Initialize database (handles migration automatically)
      await db.initialize();

      // Load data from database
      loadDataFromDatabase();

      // If no data exists, load dummy data
      const dbInvoices = db.getAllInvoices();
      if (dbInvoices.length === 0) {
        console.log('No existing data, loading demo data...');
        await loadInitialDummyData();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Fallback to empty state
      setInvoices([]);
      setCreditNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDataFromDatabase = () => {
    try {
      const dbInvoices = db.getAllInvoices();
      const dbCreditNotes = db.getAllCreditNotes();
      
      setInvoices(dbInvoices);
      setCreditNotes(dbCreditNotes);
      
      console.log(`Loaded ${dbInvoices.length} invoices and ${dbCreditNotes.length} credit notes from database`);
    } catch (error) {
      console.error('Failed to load data from database:', error);
      throw error;
    }
  };

  const loadFromLocalStorage = () => {
    console.log('Falling back to localStorage...');
    // Fallback localStorage logic (existing code)
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        setInvoices(parsed.map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date),
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
  };

  const loadInitialDummyData = async () => {
    // Load a subset of dummy data for initial demo
    for (const invoice of dummyInvoices.slice(0, 3)) {
      const scanResult: ScanResult = {
        success: true,
        confidence: 0.9,
        rawText: `Demo data for ${invoice.invoiceNumber}`,
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          supplier: invoice.supplier,
          date: invoice.date,
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          total: invoice.total,
          notes: invoice.notes,
          items: invoice.items
        }
      };

      const createdInvoice = db.createInvoice(scanResult);
      
      // Update status
      if (invoice.status !== 'pending') {
        const updatedInvoice: Invoice = {
          ...createdInvoice,
          status: invoice.status
        };
        db.updateInvoice(updatedInvoice);
      }
    }

    // Add a few credit notes
    for (const creditNote of dummyCreditNotes.slice(0, 2)) {
      db.createCreditNote({
        creditNoteNumber: creditNote.creditNoteNumber,
        supplier: creditNote.supplier,
        date: creditNote.date,
        totalAmount: creditNote.totalAmount,
        appliedToInvoiceId: creditNote.appliedToInvoiceId,
        items: creditNote.items
      });
    }

    // Reload data
    loadDataFromDatabase();
  };

  const checkDuplicates = (scanResult: ScanResult): DuplicateCheckResult => {
    return db.checkForDuplicates(scanResult);
  };

  const addInvoice = (scanResult: ScanResult, imageFile: File, forceSave: boolean = false) => {
    try {
      const newInvoice = db.createInvoice(scanResult);
      setInvoices(prev => [newInvoice, ...prev]);
      console.log('Invoice added to database:', newInvoice.invoiceNumber);
      return newInvoice;
    } catch (error) {
      console.error('Failed to add invoice:', error);
      throw error;
    }
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    try {
      db.updateInvoice(updatedInvoice);
      setInvoices(prev => prev.map(inv => 
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      ));
      console.log('Invoice updated in database:', updatedInvoice.invoiceNumber);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  };

  const updateInvoiceItem = (invoiceId: string, itemId: string, updates: Partial<InvoiceItem>) => {
    try {
      db.updateInvoiceItem(invoiceId, itemId, updates);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedInvoice = db.getInvoiceById(invoiceId);
          return updatedInvoice || invoice;
        }
        return invoice;
      }));
      
      console.log('Invoice item updated in database');
    } catch (error) {
      console.error('Failed to update invoice item:', error);
      throw error;
    }
  };

  const deleteInvoice = (invoiceId: string) => {
    try {
      db.deleteInvoice(invoiceId);
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      console.log('Invoice deleted from database');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  };

  const addCreditNote = (creditNote: Omit<CreditNote, 'id'>) => {
    try {
      const newCreditNote = db.createCreditNote(creditNote);
      setCreditNotes(prev => [newCreditNote, ...prev]);
      console.log('Credit note added to database:', newCreditNote.creditNoteNumber);
    } catch (error) {
      console.error('Failed to add credit note:', error);
      throw error;
    }
  };

  const applyCreditNoteToInvoice = (creditNoteId: string, invoiceId: string) => {
    try {
      db.applyCreditNoteToInvoice(creditNoteId, invoiceId);
      
      // Update local state
      setCreditNotes(prev => prev.map(cn => 
        cn.id === creditNoteId ? { ...cn, appliedToInvoiceId: invoiceId } : cn
      ));
      
      console.log('Credit note applied to invoice in database');
    } catch (error) {
      console.error('Failed to apply credit note:', error);
      throw error;
    }
  };

  const getInvoiceStats = () => {
    try {
      return db.getInvoiceStats();
    } catch (error) {
      console.error('Failed to get invoice stats:', error);
      // Fallback to calculating from local state
      const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);
      return {
        total: invoices.length,
        pending: invoices.filter(inv => inv.status === 'pending').length,
        partiallyDelivered: invoices.filter(inv => inv.status === 'partially_delivered').length,
        fullyDelivered: invoices.filter(inv => inv.status === 'fully_delivered').length,
        totalValue
      };
    }
  };

  const loadDummyData = async () => {
    try {
      setLoading(true);
      
      // Clear existing data
      db.clearAllData();

      // Load all dummy data sets
      const allInvoices = [...dummyInvoices, ...lastMonthInvoices, ...augustInvoices];
      const allCreditNotes = [...dummyCreditNotes, ...lastMonthCreditNotes, ...augustCreditNotes];

      // Migrate all data
      for (const invoice of allInvoices) {
        const scanResult: ScanResult = {
          success: true,
          confidence: 0.9,
          rawText: `Demo data for ${invoice.invoiceNumber}`,
          invoice: {
            invoiceNumber: invoice.invoiceNumber,
            supplier: invoice.supplier,
            date: invoice.date,
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            total: invoice.total,
            notes: invoice.notes,
            items: invoice.items
          }
        };

        const createdInvoice = db.createInvoice(scanResult);
        
        // Update status
        if (invoice.status !== 'pending') {
          const updatedInvoice: Invoice = {
            ...createdInvoice,
            status: invoice.status
          };
          db.updateInvoice(updatedInvoice);
        }
      }

      // Add credit notes
      for (const creditNote of allCreditNotes) {
        db.createCreditNote({
          creditNoteNumber: creditNote.creditNoteNumber,
          supplier: creditNote.supplier,
          date: creditNote.date,
          totalAmount: creditNote.totalAmount,
          appliedToInvoiceId: creditNote.appliedToInvoiceId,
          items: creditNote.items
        });
      }

      // Reload from database
      loadDataFromDatabase();
      console.log('Demo data loaded successfully');
    } catch (error) {
      console.error('Failed to load demo data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    try {
      // Clear database
      db.clearAllData();

      // Clear local state
      setInvoices([]);
      setCreditNotes([]);
      
      console.log('All data cleared from database');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  };

  return {
    invoices,
    creditNotes,
    loading,
    addInvoice,
    checkDuplicates,
    updateInvoice,
    updateInvoiceItem,
    deleteInvoice,
    addCreditNote,
    applyCreditNoteToInvoice,
    getInvoiceStats,
    loadDummyData,
    clearAllData
  };
};