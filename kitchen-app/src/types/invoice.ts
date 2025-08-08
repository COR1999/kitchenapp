export interface DamageReport {
  reported: boolean;
  reason?: string;
  photos?: string[]; // Array of Base64 encoded images or blob URLs
  photo?: string; // Legacy field for backward compatibility
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
  scannedAt?: Date;
  status: 'pending' | 'partially_delivered' | 'fully_delivered';
  notes?: string;
  confidence?: number; // OCR confidence level
  rawText?: string; // Raw OCR text
}

export interface CreditNoteItem {
  id?: string; // Optional for backward compatibility
  description: string;
  amount: number;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  supplier: string;
  date: Date;
  totalAmount?: number; // Optional for backward compatibility
  appliedToInvoiceId?: string;
  items: CreditNoteItem[];
  // Legacy fields for backward compatibility
  amount?: number;
  reason?: string;
  relatedInvoiceId?: string;
  appliedToInvoice?: boolean;
}

export interface ScanResult {
  success: boolean;
  invoice?: Partial<Invoice>;
  confidence: number;
  rawText: string;
  error?: string;
}