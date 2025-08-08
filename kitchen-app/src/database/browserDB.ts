import { Invoice, InvoiceItem, CreditNote, ScanResult, DamageReport } from '../types/invoice';

// Browser-compatible database using localStorage with better structure
class BrowserDatabase {
  private static instance: BrowserDatabase;
  private invoicesKey = 'kitchen-invoices-v2';
  private creditNotesKey = 'kitchen-credit-notes-v2';

  private constructor() {}

  public static getInstance(): BrowserDatabase {
    if (!BrowserDatabase.instance) {
      BrowserDatabase.instance = new BrowserDatabase();
    }
    return BrowserDatabase.instance;
  }

  // Initialize database (migrate old localStorage if needed)
  public async initialize(): Promise<void> {
    console.log('Initializing browser database...');
    
    // Check for old localStorage data and migrate
    const oldInvoices = localStorage.getItem('invoices');
    const oldCreditNotes = localStorage.getItem('creditNotes');
    
    if (oldInvoices && !localStorage.getItem(this.invoicesKey)) {
      console.log('Migrating old invoice data...');
      try {
        const parsed = JSON.parse(oldInvoices);
        const migrated = parsed.map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date),
          scannedAt: invoice.scannedAt ? new Date(invoice.scannedAt) : undefined,
          items: invoice.items.map((item: any) => ({
            ...item,
            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : undefined
          }))
        }));
        this.saveInvoices(migrated);
        localStorage.removeItem('invoices'); // Clean up old data
      } catch (error) {
        console.error('Failed to migrate old invoice data:', error);
      }
    }

    if (oldCreditNotes && !localStorage.getItem(this.creditNotesKey)) {
      console.log('Migrating old credit note data...');
      try {
        const parsed = JSON.parse(oldCreditNotes);
        const migrated = parsed.map((creditNote: any) => ({
          ...creditNote,
          date: new Date(creditNote.date)
        }));
        this.saveCreditNotes(migrated);
        localStorage.removeItem('creditNotes'); // Clean up old data
      } catch (error) {
        console.error('Failed to migrate old credit note data:', error);
      }
    }

    console.log('Browser database initialized');
  }

  // Invoice operations
  public getAllInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(this.invoicesKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((invoice: any) => ({
        ...invoice,
        date: new Date(invoice.date),
        scannedAt: invoice.scannedAt ? new Date(invoice.scannedAt) : undefined,
        items: invoice.items.map((item: any) => ({
          ...item,
          deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : undefined,
          damageReport: item.damageReport ? {
            ...item.damageReport,
            reportedAt: item.damageReport.reportedAt ? new Date(item.damageReport.reportedAt) : undefined
          } : undefined
        }))
      }));
    } catch (error) {
      console.error('Failed to get invoices:', error);
      return [];
    }
  }

  public getInvoiceById(id: string): Invoice | null {
    const invoices = this.getAllInvoices();
    return invoices.find(inv => inv.id === id) || null;
  }

  public createInvoice(scanResult: ScanResult): Invoice {
    if (!scanResult.invoice || !scanResult.invoice.invoiceNumber || !scanResult.invoice.supplier || !scanResult.invoice.date) {
      throw new Error('Invalid scan result: missing required invoice data');
    }

    const invoiceId = Date.now().toString();
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: scanResult.invoice.invoiceNumber,
      supplier: scanResult.invoice.supplier,
      supplierAddress: scanResult.invoice.supplierAddress,
      date: scanResult.invoice.date,
      subtotal: scanResult.invoice.subtotal || 0,
      tax: scanResult.invoice.tax || 0,
      total: scanResult.invoice.total || 0,
      status: 'pending',
      confidence: scanResult.confidence,
      rawText: scanResult.rawText,
      scannedAt: new Date(),
      notes: scanResult.invoice.notes,
      items: (scanResult.invoice.items || []).map((item, index) => ({
        ...item,
        id: `${invoiceId}_${index}_${Date.now()}`
      }))
    };

    const invoices = this.getAllInvoices();
    invoices.unshift(newInvoice);
    this.saveInvoices(invoices);

    return newInvoice;
  }

  public updateInvoice(updatedInvoice: Invoice): void {
    const invoices = this.getAllInvoices();
    const index = invoices.findIndex(inv => inv.id === updatedInvoice.id);
    
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices[index] = updatedInvoice;
    this.saveInvoices(invoices);
  }

  public updateInvoiceItem(invoiceId: string, itemId: string, updates: Partial<InvoiceItem>): void {
    const invoices = this.getAllInvoices();
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const itemIndex = invoice.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Invoice item not found');
    }

    // Update the item
    invoice.items[itemIndex] = { ...invoice.items[itemIndex], ...updates };

    // Update invoice status based on delivery status
    this.updateInvoiceStatus(invoice);
    
    this.saveInvoices(invoices);
  }

  public deleteInvoice(invoiceId: string): void {
    const invoices = this.getAllInvoices();
    const filteredInvoices = invoices.filter(inv => inv.id !== invoiceId);
    this.saveInvoices(filteredInvoices);
  }

  private updateInvoiceStatus(invoice: Invoice): void {
    const deliveredCount = invoice.items.filter(item => item.delivered).length;
    const totalCount = invoice.items.length;

    if (deliveredCount === 0) {
      invoice.status = 'pending';
    } else if (deliveredCount === totalCount) {
      invoice.status = 'fully_delivered';
    } else {
      invoice.status = 'partially_delivered';
    }
  }

  private saveInvoices(invoices: Invoice[]): void {
    try {
      localStorage.setItem(this.invoicesKey, JSON.stringify(invoices));
    } catch (error) {
      console.error('Failed to save invoices:', error);
      throw error;
    }
  }

  // Credit Note operations
  public getAllCreditNotes(): CreditNote[] {
    try {
      const data = localStorage.getItem(this.creditNotesKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((creditNote: any) => ({
        ...creditNote,
        date: new Date(creditNote.date)
      }));
    } catch (error) {
      console.error('Failed to get credit notes:', error);
      return [];
    }
  }

  public createCreditNote(creditNoteData: Omit<CreditNote, 'id'>): CreditNote {
    const creditNoteId = Date.now().toString();
    const newCreditNote: CreditNote = {
      ...creditNoteData,
      id: creditNoteId,
      totalAmount: creditNoteData.totalAmount || creditNoteData.amount || 0,
      items: creditNoteData.items.map((item, index) => ({
        ...item,
        id: item.id || `${creditNoteId}_${index}`
      }))
    };

    const creditNotes = this.getAllCreditNotes();
    creditNotes.unshift(newCreditNote);
    this.saveCreditNotes(creditNotes);

    return newCreditNote;
  }

  public applyCreditNoteToInvoice(creditNoteId: string, invoiceId: string): void {
    const creditNotes = this.getAllCreditNotes();
    const creditNote = creditNotes.find(cn => cn.id === creditNoteId);
    
    if (!creditNote) {
      throw new Error('Credit note not found');
    }

    creditNote.appliedToInvoiceId = invoiceId;
    this.saveCreditNotes(creditNotes);
  }

  private saveCreditNotes(creditNotes: CreditNote[]): void {
    try {
      localStorage.setItem(this.creditNotesKey, JSON.stringify(creditNotes));
    } catch (error) {
      console.error('Failed to save credit notes:', error);
      throw error;
    }
  }

  // Statistics
  public getInvoiceStats() {
    const invoices = this.getAllInvoices();
    const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    return {
      total: invoices.length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      partiallyDelivered: invoices.filter(inv => inv.status === 'partially_delivered').length,
      fullyDelivered: invoices.filter(inv => inv.status === 'fully_delivered').length,
      totalValue
    };
  }

  // Utility methods
  public clearAllData(): void {
    localStorage.removeItem(this.invoicesKey);
    localStorage.removeItem(this.creditNotesKey);
  }

  public exportDatabase(): { invoices: Invoice[], creditNotes: CreditNote[] } {
    return {
      invoices: this.getAllInvoices(),
      creditNotes: this.getAllCreditNotes()
    };
  }

  public importDatabase(data: { invoices: Invoice[], creditNotes: CreditNote[] }): void {
    this.saveInvoices(data.invoices);
    this.saveCreditNotes(data.creditNotes);
  }
}

export default BrowserDatabase;