export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  delivered: boolean;
  deliveryDate?: Date;
  creditNoteApplied?: boolean;
  creditNoteAmount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierAddress?: string;
  date: Date;
  dueDate?: Date;
  subtotal: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
  imageUrl?: string;
  scannedAt: Date;
  status: 'pending' | 'partially_delivered' | 'fully_delivered' | 'overdue';
  notes?: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  supplier: string;
  date: Date;
  amount: number;
  reason: string;
  relatedInvoiceId?: string;
  items: {
    description: string;
    amount: number;
  }[];
  appliedToInvoice: boolean;
}

export interface ScanResult {
  success: boolean;
  invoice?: Partial<Invoice>;
  confidence: number;
  rawText: string;
  error?: string;
}