import Tesseract from 'tesseract.js';
import { ScanResult, Invoice, InvoiceItem } from '../types/invoice';

export class OCRService {
  private static parseInvoiceText(text: string): Partial<Invoice> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let invoice: Partial<Invoice> = {
      items: []
    };

    // Common patterns for invoice parsing
    const invoiceNumberRegex = /(?:invoice|inv)(?:\s*#?\s*|:\s*)([a-zA-Z0-9-]+)/i;
    const supplierRegex = /^([A-Z][A-Za-z\s&.,]+)$/;
    const dateRegex = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/;
    const amountRegex = /\$?(\d+[,.]?\d*\.?\d{2})/g;
    const totalRegex = /(?:total|amount due)[\s:]*\$?(\d+[,.]?\d*\.?\d{2})/i;
    const subtotalRegex = /(?:subtotal|sub-total)[\s:]*\$?(\d+[,.]?\d*\.?\d{2})/i;
    const taxRegex = /(?:tax|vat|gst)[\s:]*\$?(\d+[,.]?\d*\.?\d{2})/i;

    let currentSupplier = '';
    let itemId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract invoice number
      const invoiceMatch = line.match(invoiceNumberRegex);
      if (invoiceMatch && !invoice.invoiceNumber) {
        invoice.invoiceNumber = invoiceMatch[1];
      }

      // Extract supplier (usually at the top, capitalized)
      if (!currentSupplier && i < 5) {
        const supplierMatch = line.match(supplierRegex);
        if (supplierMatch && line.length > 3 && line.length < 50) {
          currentSupplier = line;
          invoice.supplier = currentSupplier;
        }
      }

      // Extract dates
      const dateMatch = line.match(dateRegex);
      if (dateMatch && !invoice.date) {
        const parsedDate = new Date(dateMatch[1]);
        if (!isNaN(parsedDate.getTime())) {
          invoice.date = parsedDate;
        }
      }

      // Extract totals
      const totalMatch = line.match(totalRegex);
      if (totalMatch) {
        invoice.total = parseFloat(totalMatch[1].replace(',', ''));
      }

      const subtotalMatch = line.match(subtotalRegex);
      if (subtotalMatch) {
        invoice.subtotal = parseFloat(subtotalMatch[1].replace(',', ''));
      }

      const taxMatch = line.match(taxRegex);
      if (taxMatch) {
        invoice.tax = parseFloat(taxMatch[1].replace(',', ''));
      }

      // Extract line items (look for patterns with descriptions and amounts)
      const amounts = Array.from(line.matchAll(amountRegex));
      if (amounts.length > 0 && 
          !line.toLowerCase().includes('total') &&
          !line.toLowerCase().includes('subtotal') &&
          !line.toLowerCase().includes('tax') &&
          line.length > 10) {
        
        const lastAmount = amounts[amounts.length - 1];
        const price = parseFloat(lastAmount[1].replace(',', ''));
        
        if (price > 0) {
          const description = line.replace(lastAmount[0], '').trim();
          
          if (description.length > 0) {
            const item: InvoiceItem = {
              id: itemId.toString(),
              description: description,
              quantity: 1, // Default to 1, could be enhanced to parse quantity
              unitPrice: price,
              totalPrice: price,
              delivered: false
            };
            
            invoice.items = invoice.items || [];
            invoice.items.push(item);
            itemId++;
          }
        }
      }
    }

    // Calculate missing totals if we have items
    if (invoice.items && invoice.items.length > 0) {
      const itemsTotal = invoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      if (!invoice.subtotal) {
        invoice.subtotal = itemsTotal;
      }
      
      if (!invoice.tax && invoice.total && invoice.subtotal) {
        invoice.tax = invoice.total - invoice.subtotal;
      }
      
      if (!invoice.total) {
        invoice.total = (invoice.subtotal || 0) + (invoice.tax || 0);
      }
    }

    return invoice;
  }

  public static async scanInvoice(imageFile: File): Promise<ScanResult> {
    try {
      const { data: { text, confidence } } = await Tesseract.recognize(
        imageFile,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      if (confidence < 30) {
        return {
          success: false,
          confidence: confidence / 100,
          rawText: text,
          error: 'Low confidence in text recognition. Please try a clearer image.'
        };
      }

      const parsedInvoice = this.parseInvoiceText(text);

      if (!parsedInvoice.supplier && !parsedInvoice.total && !parsedInvoice.items?.length) {
        return {
          success: false,
          confidence: confidence / 100,
          rawText: text,
          error: 'Could not extract invoice information. Please verify the image contains a valid invoice.'
        };
      }

      return {
        success: true,
        confidence: confidence / 100,
        rawText: text,
        invoice: parsedInvoice
      };

    } catch (error) {
      console.error('OCR Error:', error);
      return {
        success: false,
        confidence: 0,
        rawText: '',
        error: 'Failed to process image. Please try again.'
      };
    }
  }
}