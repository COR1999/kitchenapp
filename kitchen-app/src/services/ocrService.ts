import Tesseract from 'tesseract.js';
import { ScanResult, Invoice, InvoiceItem } from '../types/invoice';

export class OCRService {
  private static parseInvoiceText(text: string): Partial<Invoice> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let invoice: Partial<Invoice> = {
      items: []
    };

    console.log('OCR Raw Text:', text); // Debug logging

    // Enhanced patterns for invoice parsing
    const invoiceNumberRegex = /(?:invoice|inv|delivery|ticket)(?:\s*#?\s*|:\s*)([a-zA-Z0-9-]+)/i;
    const supplierRegex = /^(sysco|[A-Z][A-Za-z\s&.,]{2,30})$/i;
    const dateRegex = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/;
    const amountRegex = /(\d+[,.]?\d*\.?\d{0,2})/g;
    const totalRegex = /(?:total|amount\s*due|invoice\s*total)[\s:]*\$?(\d+[,.]?\d*\.?\d{2})/i;
    const subtotalRegex = /(?:subtotal|sub-total|merchandise)[\s:]*\$?(\d+[,.]?\d*\.?\d{2})/i;
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

      // Extract supplier - look for "Sysco" specifically or other patterns
      if (!currentSupplier && i < 10) {
        if (line.toLowerCase().includes('sysco')) {
          currentSupplier = 'Sysco';
          invoice.supplier = currentSupplier;
        } else {
          const supplierMatch = line.match(supplierRegex);
          if (supplierMatch && line.length > 3 && line.length < 50) {
            currentSupplier = supplierMatch[1];
            invoice.supplier = currentSupplier;
          }
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

      // Extract totals with better patterns
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

      // Enhanced line item extraction for table formats
      const amounts = Array.from(line.matchAll(amountRegex));
      if (amounts.length >= 2 && 
          !line.toLowerCase().includes('total') &&
          !line.toLowerCase().includes('subtotal') &&
          !line.toLowerCase().includes('tax') &&
          !line.toLowerCase().includes('date') &&
          !line.toLowerCase().includes('page') &&
          line.length > 15) {
        
        // Try to parse structured table data (description, qty, unit price, total)
        const numbers = amounts.map(a => parseFloat(a[1].replace(',', '')));
        
        if (numbers.length >= 2 && numbers.some(n => n > 0)) {
          // Find the largest number as likely total price
          const totalPrice = Math.max(...numbers.filter(n => n > 0));
          const unitPrice = numbers.find(n => n > 0 && n <= totalPrice) || totalPrice;
          const quantity = numbers.find(n => n >= 1 && n !== unitPrice && n !== totalPrice) || 1;
          
          // Extract description (everything before the first number)
          let description = line;
          for (const amount of amounts) {
            description = description.replace(amount[0], '').trim();
          }
          
          // Clean up description
          description = description.replace(/^\d+\s*/, '').trim(); // Remove leading item numbers
          
          if (description.length > 2 && totalPrice > 0) {
            const item: InvoiceItem = {
              id: itemId.toString(),
              description: description,
              quantity: quantity,
              unitPrice: unitPrice,
              totalPrice: totalPrice,
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

      console.log(`OCR Confidence: ${confidence}%`); // Debug logging

      if (confidence < 20) {
        return {
          success: false,
          confidence: confidence / 100,
          rawText: text,
          error: 'Low confidence in text recognition. Please try a clearer image.'
        };
      }

      const parsedInvoice = this.parseInvoiceText(text);

      // Be more lenient - if we have ANY useful information, consider it a success
      if (!parsedInvoice.supplier && !parsedInvoice.total && !parsedInvoice.items?.length && !parsedInvoice.invoiceNumber) {
        return {
          success: false,
          confidence: confidence / 100,
          rawText: text,
          error: 'Could not extract invoice information. Please verify the image contains a valid invoice.'
        };
      }

      // If we don't have a supplier but found other info, set a default
      if (!parsedInvoice.supplier) {
        parsedInvoice.supplier = 'Unknown Supplier';
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