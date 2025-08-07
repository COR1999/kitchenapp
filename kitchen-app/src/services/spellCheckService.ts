import { Invoice } from '../types/invoice';

export interface SpellCheckSuggestion {
  field: 'supplier' | 'itemDescription' | 'invoiceNumber';
  originalValue: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
  itemIndex?: number;
}

export interface SpellCheckResult {
  hasErrors: boolean;
  suggestions: SpellCheckSuggestion[];
  correctedInvoice?: Partial<Invoice>;
}

export class SpellCheckService {
  // Common supplier names - could be expanded with a larger database
  private static readonly KNOWN_SUPPLIERS = [
    'Sysco Corporation',
    'US Foods',
    'Performance Food Group',
    'Restaurant Depot',
    'Beverage Distributors Inc',
    'Food Service Distributors',
    'Prime Source Building Products',
    'Gordon Food Service',
    'Ben E. Keith Foods',
    'Reinhart FoodService',
    'Martin Bros Distributing',
    'McLane Company',
    'KeHE Distributors',
    'UniPro Foodservice',
    'Shamrock Foods',
    'Dot Foods',
    'Great Lakes Wine & Spirits',
    'Republic National Distributing',
    'Southern Glazers Wine & Spirits'
  ];

  // Common food/kitchen terms for item descriptions
  private static readonly FOOD_TERMS = [
    'salmon', 'chicken', 'beef', 'pork', 'lamb', 'duck', 'turkey', 'fish', 'shrimp', 'lobster',
    'lettuce', 'spinach', 'tomato', 'onion', 'garlic', 'potato', 'carrot', 'celery', 'pepper',
    'cheese', 'butter', 'cream', 'milk', 'yogurt', 'mozzarella', 'cheddar', 'parmesan',
    'olive oil', 'canola oil', 'vinegar', 'salt', 'pepper', 'flour', 'sugar', 'spices',
    'organic', 'fresh', 'frozen', 'premium', 'grade', 'whole', 'ground', 'sliced', 'diced',
    'case', 'pound', 'ounce', 'gallon', 'liter', 'bottle', 'bag', 'box', 'container'
  ];

  /**
   * Calculates the Levenshtein distance between two strings
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
   * Calculates similarity between two strings (0-1 scale)
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 1;
    
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - (distance / maxLength);
  }

  /**
   * Finds the best match from a list of known terms
   */
  private static findBestMatch(input: string, knownTerms: string[], threshold: number = 0.6): {
    match: string;
    confidence: number;
  } | null {
    if (!input || input.trim() === '') return null;

    let bestMatch = '';
    let bestScore = 0;

    for (const term of knownTerms) {
      const similarity = this.calculateSimilarity(input, term);
      if (similarity > bestScore && similarity >= threshold) {
        bestScore = similarity;
        bestMatch = term;
      }
    }

    return bestScore > 0 ? { match: bestMatch, confidence: bestScore } : null;
  }

  /**
   * Checks supplier name for typos and spelling errors
   */
  private static checkSupplierSpelling(supplierName: string): SpellCheckSuggestion | null {
    if (!supplierName || supplierName.trim() === '') return null;

    const bestMatch = this.findBestMatch(supplierName, this.KNOWN_SUPPLIERS, 0.7);
    
    if (bestMatch && bestMatch.match !== supplierName.trim()) {
      return {
        field: 'supplier',
        originalValue: supplierName,
        suggestedValue: bestMatch.match,
        confidence: bestMatch.confidence,
        reason: `Possible misspelling of known supplier "${bestMatch.match}"`
      };
    }

    return null;
  }

  /**
   * Checks invoice number format and common patterns
   */
  private static checkInvoiceNumberFormat(invoiceNumber: string): SpellCheckSuggestion | null {
    if (!invoiceNumber || invoiceNumber.trim() === '') return null;

    const cleaned = invoiceNumber.trim();
    
    // Check for common OCR errors in invoice numbers
    const commonReplacements = [
      { from: /[O0]/g, to: '0', pattern: /^[A-Z]+-\d{4}-\d+$/ }, // Replace O with 0 in numeric sections
      { from: /[Il1]/g, to: '1', pattern: /\d+/ }, // Replace I,l with 1 in numeric sections
      { from: /[S5]/g, to: '5', pattern: /\d+/ }, // Replace S with 5 in numeric sections
    ];

    for (const replacement of commonReplacements) {
      if (replacement.pattern.test(cleaned)) {
        const suggested = cleaned.replace(replacement.from, replacement.to.toString());
        if (suggested !== cleaned) {
          return {
            field: 'invoiceNumber',
            originalValue: invoiceNumber,
            suggestedValue: suggested,
            confidence: 0.8,
            reason: 'Common OCR character confusion in invoice number'
          };
        }
      }
    }

    return null;
  }

  /**
   * Checks item descriptions for food-related typos
   */
  private static checkItemDescription(description: string, itemIndex: number): SpellCheckSuggestion[] {
    if (!description || description.trim() === '') return [];

    const suggestions: SpellCheckSuggestion[] = [];
    const words = description.toLowerCase().split(/\s+/);
    const correctedWords: string[] = [];
    let hasChanges = false;

    for (const word of words) {
      // Remove punctuation and numbers for spell checking
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length < 3) {
        correctedWords.push(word);
        continue;
      }

      const bestMatch = this.findBestMatch(cleanWord, this.FOOD_TERMS, 0.75);
      
      if (bestMatch && bestMatch.match !== cleanWord) {
        // Replace the clean word but preserve original punctuation
        const correctedWord = word.replace(cleanWord, bestMatch.match);
        correctedWords.push(correctedWord);
        hasChanges = true;
      } else {
        correctedWords.push(word);
      }
    }

    if (hasChanges) {
      // Restore original capitalization pattern
      const correctedDescription = this.restoreCapitalization(description, correctedWords.join(' '));
      
      suggestions.push({
        field: 'itemDescription',
        originalValue: description,
        suggestedValue: correctedDescription,
        confidence: 0.7,
        reason: 'Corrected potential food-related spelling errors',
        itemIndex
      });
    }

    return suggestions;
  }

  /**
   * Restores the original capitalization pattern to a corrected string
   */
  private static restoreCapitalization(original: string, corrected: string): string {
    const originalWords = original.split(/\s+/);
    const correctedWords = corrected.split(/\s+/);
    const result: string[] = [];

    for (let i = 0; i < Math.min(originalWords.length, correctedWords.length); i++) {
      const origWord = originalWords[i];
      const corrWord = correctedWords[i];
      
      if (origWord.length === 0) {
        result.push(corrWord);
        continue;
      }

      let finalWord = corrWord;
      
      // Apply capitalization pattern from original
      if (origWord[0] === origWord[0].toUpperCase()) {
        finalWord = corrWord.charAt(0).toUpperCase() + corrWord.slice(1).toLowerCase();
      }
      
      if (origWord === origWord.toUpperCase()) {
        finalWord = corrWord.toUpperCase();
      }
      
      result.push(finalWord);
    }

    return result.join(' ');
  }

  /**
   * Performs comprehensive spell checking on an invoice or partial invoice
   */
  public static checkInvoiceSpelling(invoice: Partial<Invoice>): SpellCheckResult {
    const suggestions: SpellCheckSuggestion[] = [];

    // Check supplier name
    if (invoice.supplier) {
      const supplierSuggestion = this.checkSupplierSpelling(invoice.supplier);
      if (supplierSuggestion) {
        suggestions.push(supplierSuggestion);
      }
    }

    // Check invoice number format
    if (invoice.invoiceNumber) {
      const invoiceNumberSuggestion = this.checkInvoiceNumberFormat(invoice.invoiceNumber);
      if (invoiceNumberSuggestion) {
        suggestions.push(invoiceNumberSuggestion);
      }
    }

    // Check item descriptions
    if (invoice.items && Array.isArray(invoice.items)) {
      invoice.items.forEach((item, index) => {
        if (item.description) {
          const itemSuggestions = this.checkItemDescription(item.description, index);
          suggestions.push(...itemSuggestions);
        }
      });
    }

    // Create corrected invoice if there are suggestions
    let correctedInvoice: Partial<Invoice> | undefined;
    if (suggestions.length > 0) {
      correctedInvoice = { ...invoice };
      
      suggestions.forEach(suggestion => {
        switch (suggestion.field) {
          case 'supplier':
            correctedInvoice!.supplier = suggestion.suggestedValue;
            break;
          case 'invoiceNumber':
            correctedInvoice!.invoiceNumber = suggestion.suggestedValue;
            break;
          case 'itemDescription':
            if (suggestion.itemIndex !== undefined && correctedInvoice!.items) {
              correctedInvoice!.items[suggestion.itemIndex].description = suggestion.suggestedValue;
            }
            break;
        }
      });
    }

    return {
      hasErrors: suggestions.length > 0,
      suggestions,
      correctedInvoice
    };
  }

  /**
   * Gets a human-readable description of spell check results
   */
  public static getSpellCheckSummary(result: SpellCheckResult): string {
    if (!result.hasErrors) {
      return 'No spelling errors detected.';
    }

    const errorCount = result.suggestions.length;
    const fieldTypesSet = new Set(result.suggestions.map(s => s.field));
    const fieldTypes = Array.from(fieldTypesSet);
    
    return `Found ${errorCount} potential spelling error${errorCount > 1 ? 's' : ''} in ${fieldTypes.join(', ')}.`;
  }
}