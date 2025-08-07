import { Invoice, ScanResult } from '../types/invoice';

export interface DuplicateMatch {
  existingInvoice: Invoice;
  matchScore: number;
  matchReasons: string[];
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
  confidence: 'high' | 'medium' | 'low';
}

export class DuplicateDetectionService {
  private static readonly INVOICE_NUMBER_WEIGHT = 0.4;
  private static readonly SUPPLIER_WEIGHT = 0.25;
  private static readonly DATE_WEIGHT = 0.2;
  private static readonly TOTAL_WEIGHT = 0.15;

  private static readonly HIGH_CONFIDENCE_THRESHOLD = 0.8;
  private static readonly MEDIUM_CONFIDENCE_THRESHOLD = 0.6;

  /**
   * Calculates similarity between two strings (0-1 scale)
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 1;
    
    // Use Levenshtein distance for similarity
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - (distance / maxLength);
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Calculates date similarity (closer dates get higher scores)
   */
  private static calculateDateSimilarity(date1: Date, date2: Date): number {
    const daysDiff = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 1;
    if (daysDiff <= 1) return 0.9;
    if (daysDiff <= 3) return 0.7;
    if (daysDiff <= 7) return 0.5;
    if (daysDiff <= 30) return 0.3;
    
    return 0.1;
  }

  /**
   * Calculates total amount similarity
   */
  private static calculateTotalSimilarity(total1: number, total2: number): number {
    if (total1 === total2) return 1;
    
    const difference = Math.abs(total1 - total2);
    const average = (total1 + total2) / 2;
    
    if (average === 0) return total1 === total2 ? 1 : 0;
    
    const percentDiff = difference / average;
    
    if (percentDiff <= 0.01) return 0.95; // Within 1%
    if (percentDiff <= 0.05) return 0.8;  // Within 5%
    if (percentDiff <= 0.1) return 0.6;   // Within 10%
    if (percentDiff <= 0.2) return 0.3;   // Within 20%
    
    return 0.1;
  }

  /**
   * Calculates match score between scanned invoice data and existing invoice
   */
  private static calculateMatchScore(
    scannedData: Partial<Invoice>, 
    existingInvoice: Invoice
  ): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let totalScore = 0;

    // Invoice number similarity
    if (scannedData.invoiceNumber && existingInvoice.invoiceNumber) {
      const invoiceNumberScore = this.calculateStringSimilarity(
        scannedData.invoiceNumber, 
        existingInvoice.invoiceNumber
      );
      totalScore += invoiceNumberScore * this.INVOICE_NUMBER_WEIGHT;
      
      if (invoiceNumberScore > 0.8) {
        reasons.push(`Invoice number very similar: "${scannedData.invoiceNumber}" ↔ "${existingInvoice.invoiceNumber}"`);
      }
    }

    // Supplier similarity
    if (scannedData.supplier && existingInvoice.supplier) {
      const supplierScore = this.calculateStringSimilarity(
        scannedData.supplier, 
        existingInvoice.supplier
      );
      totalScore += supplierScore * this.SUPPLIER_WEIGHT;
      
      if (supplierScore > 0.8) {
        reasons.push(`Same supplier: "${scannedData.supplier}"`);
      }
    }

    // Date similarity
    if (scannedData.date && existingInvoice.date) {
      const dateScore = this.calculateDateSimilarity(scannedData.date, existingInvoice.date);
      totalScore += dateScore * this.DATE_WEIGHT;
      
      if (dateScore > 0.8) {
        reasons.push(`Same or very close date: ${scannedData.date.toLocaleDateString()} ↔ ${existingInvoice.date.toLocaleDateString()}`);
      }
    }

    // Total amount similarity
    if (scannedData.total !== undefined && existingInvoice.total !== undefined) {
      const totalSimilarity = this.calculateTotalSimilarity(scannedData.total, existingInvoice.total);
      totalScore += totalSimilarity * this.TOTAL_WEIGHT;
      
      if (totalSimilarity > 0.8) {
        reasons.push(`Same or similar total: $${scannedData.total.toFixed(2)} ↔ $${existingInvoice.total.toFixed(2)}`);
      }
    }

    return { score: totalScore, reasons };
  }

  /**
   * Checks if a scanned invoice is likely a duplicate of existing invoices
   */
  public static checkForDuplicates(
    scanResult: ScanResult, 
    existingInvoices: Invoice[]
  ): DuplicateCheckResult {
    if (!scanResult.success || !scanResult.invoice) {
      return {
        isDuplicate: false,
        matches: [],
        confidence: 'low'
      };
    }

    const matches: DuplicateMatch[] = [];
    const scannedData = scanResult.invoice;

    // Check against all existing invoices
    for (const existingInvoice of existingInvoices) {
      const { score, reasons } = this.calculateMatchScore(scannedData, existingInvoice);
      
      if (score > this.MEDIUM_CONFIDENCE_THRESHOLD) {
        matches.push({
          existingInvoice,
          matchScore: score,
          matchReasons: reasons
        });
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Determine overall confidence
    let confidence: 'high' | 'medium' | 'low' = 'low';
    const highestScore = matches[0]?.matchScore || 0;
    
    if (highestScore >= this.HIGH_CONFIDENCE_THRESHOLD) {
      confidence = 'high';
    } else if (highestScore >= this.MEDIUM_CONFIDENCE_THRESHOLD) {
      confidence = 'medium';
    }

    return {
      isDuplicate: matches.length > 0,
      matches,
      confidence
    };
  }

  /**
   * Gets a human-readable description of the duplicate check result
   */
  public static getDuplicateDescription(result: DuplicateCheckResult): string {
    if (!result.isDuplicate) {
      return 'No similar invoices found.';
    }

    const topMatch = result.matches[0];
    const scorePercent = Math.round(topMatch.matchScore * 100);
    
    if (result.confidence === 'high') {
      return `Very likely duplicate (${scorePercent}% match) of invoice ${topMatch.existingInvoice.invoiceNumber}`;
    } else if (result.confidence === 'medium') {
      return `Possible duplicate (${scorePercent}% match) of invoice ${topMatch.existingInvoice.invoiceNumber}`;
    } else {
      return `Similar to existing invoice ${topMatch.existingInvoice.invoiceNumber} (${scorePercent}% match)`;
    }
  }
}