import React, { useState } from 'react';
import { Invoice } from '../types/invoice';
import { SpellCheckResult, SpellCheckSuggestion } from '../services/spellCheckService';

interface SpellCheckDialogProps {
  originalInvoice: Partial<Invoice>;
  spellCheckResult: SpellCheckResult;
  onApplyCorrections: (correctedInvoice: Partial<Invoice>, appliedSuggestions: SpellCheckSuggestion[]) => void;
  onSkipCorrections: () => void;
  onCancel: () => void;
}

const SpellCheckDialog: React.FC<SpellCheckDialogProps> = ({
  originalInvoice,
  spellCheckResult,
  onApplyCorrections,
  onSkipCorrections,
  onCancel
}) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(
    new Set(Array.from({ length: spellCheckResult.suggestions.length }, (_, i) => i))
  );

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleApplySelected = () => {
    const appliedSuggestions = spellCheckResult.suggestions.filter((_, index) => 
      selectedSuggestions.has(index)
    );

    // Create corrected invoice with only selected suggestions
    let correctedInvoice = { ...originalInvoice };
    
    appliedSuggestions.forEach(suggestion => {
      switch (suggestion.field) {
        case 'supplier':
          correctedInvoice.supplier = suggestion.suggestedValue;
          break;
        case 'invoiceNumber':
          correctedInvoice.invoiceNumber = suggestion.suggestedValue;
          break;
        case 'itemDescription':
          if (suggestion.itemIndex !== undefined && correctedInvoice.items) {
            correctedInvoice.items[suggestion.itemIndex].description = suggestion.suggestedValue;
          }
          break;
      }
    });

    onApplyCorrections(correctedInvoice, appliedSuggestions);
  };

  const getFieldDisplayName = (field: string): string => {
    switch (field) {
      case 'supplier': return 'Supplier';
      case 'invoiceNumber': return 'Invoice Number';
      case 'itemDescription': return 'Item Description';
      default: return field;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Spelling Check Results
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review and select corrections for handwritten invoice text
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-blue-900">
                Found {spellCheckResult.suggestions.length} potential correction{spellCheckResult.suggestions.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              These suggestions are based on common OCR errors in handwritten text and known supplier names. 
              Review each suggestion and select the ones you want to apply.
            </p>
          </div>

          {/* Corrections List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Suggested Corrections
            </h3>
            
            {spellCheckResult.suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`suggestion-${index}`}
                    checked={selectedSuggestions.has(index)}
                    onChange={() => toggleSuggestion(index)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {getFieldDisplayName(suggestion.field)}
                        </span>
                        {suggestion.itemIndex !== undefined && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Item #{suggestion.itemIndex + 1}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded border ${getConfidenceColor(suggestion.confidence)}`}>
                        {getConfidenceLabel(suggestion.confidence)} ({Math.round(suggestion.confidence * 100)}%)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Original Text
                        </label>
                        <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded text-sm">
                          <span className="text-red-800 font-mono">
                            {suggestion.originalValue || '(empty)'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Suggested Correction
                        </label>
                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded text-sm">
                          <span className="text-green-800 font-mono">
                            {suggestion.suggestedValue}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Reason:</strong> {suggestion.reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedSuggestions.size} of {spellCheckResult.suggestions.length} corrections selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSuggestions(new Set())}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Deselect All
                </button>
                <button
                  onClick={() => setSelectedSuggestions(new Set(Array.from({ length: spellCheckResult.suggestions.length }, (_, i) => i)))}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={onSkipCorrections}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Skip Spell Check
            </button>
            
            <button
              onClick={handleApplySelected}
              disabled={selectedSuggestions.size === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply {selectedSuggestions.size} Correction{selectedSuggestions.size !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellCheckDialog;