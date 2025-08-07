export interface DamageReport {
  reported: boolean;
  reason?: string;
  photo?: string; // Base64 encoded image or blob URL
  reportedAt?: Date;
  severity?: 'minor' | 'major' | 'total_loss';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  batchCode?: string;
  delivered: boolean;
  deliveryDate?: Date;
  creditNoteApplied?: boolean;
  creditNoteAmount?: number;
  damageReport?: DamageReport;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierAddress?: string;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
  imageUrl?: string;
  scannedAt: Date;
  status: 'pending' | 'partially_delivered' | 'fully_delivered';
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