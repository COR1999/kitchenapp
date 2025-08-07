import React, { useState } from 'react';
import { Invoice } from '../types/invoice';
import InvoiceCard from './InvoiceCard';
import InvoiceDetails from './InvoiceDetails';
import InvoiceScanner from './InvoiceScanner';
import InvoiceEditor from './InvoiceEditor';
import CreditNoteManager from './CreditNoteManager';
import FoodTraceability from './FoodTraceability';
import { useInvoices } from '../hooks/useInvoices';

const Dashboard: React.FC = () => {
  const { 
    invoices, 
    creditNotes, 
    loading, 
    addInvoice,
    updateInvoice, 
    updateInvoiceItem, 
    getInvoiceStats,
    addCreditNote,
    applyCreditNoteToInvoice,
    loadDummyData,
    clearAllData
  } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [currentTab, setCurrentTab] = useState<'invoices' | 'creditnotes' | 'traceability'>('invoices');
  const [filter, setFilter] = useState<'all' | 'pending' | 'partially_delivered' | 'fully_delivered'>('all');

  const stats = getInvoiceStats();

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  const handleScanComplete = (result: any, imageFile: File) => {
    try {
      addInvoice(result, imageFile);
      setShowScanner(false);
    } catch (error) {
      console.error('Failed to add invoice:', error);
      alert('Failed to process invoice. Please try again.');
    }
  };

  const handleUpdateItem = (itemId: string, updates: any) => {
    if (selectedInvoice) {
      updateInvoiceItem(selectedInvoice.id, itemId, updates);
      // Update the selected invoice to reflect changes
      const updatedInvoice = { 
        ...selectedInvoice, 
        items: selectedInvoice.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ) 
      };
      setSelectedInvoice(updatedInvoice);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSelectedInvoice(null); // Close details modal if open
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    updateInvoice(updatedInvoice);
    setEditingInvoice(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Manager</h1>
            <p className="text-gray-600 mt-1">Scan, track, and manage your invoices</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Demo Data Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={loadDummyData}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
                title="Load demo data for testing"
              >
                Load Demo Data
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                title="Clear all data"
              >
                Clear All
              </button>
            </div>
            
            {currentTab === 'invoices' && (
              <button
                onClick={() => setShowScanner(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Scan Invoice</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow">
          <button
            onClick={() => setCurrentTab('invoices')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              currentTab === 'invoices'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Invoices</span>
          </button>
          <button
            onClick={() => setCurrentTab('creditnotes')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              currentTab === 'creditnotes'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Credit Notes</span>
          </button>
          <button
            onClick={() => setCurrentTab('traceability')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              currentTab === 'traceability'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Food Traceability</span>
          </button>
        </div>

        {currentTab === 'invoices' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Invoices</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Pending</div>
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Partially Delivered</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.partiallyDelivered}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Fully Delivered</div>
                <div className="text-2xl font-bold text-green-600">{stats.fullyDelivered}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Value</div>
                <div className="text-2xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'partially_delivered', label: 'Partial' },
                { key: 'fully_delivered', label: 'Complete' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Invoices Grid */}
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 'Get started by scanning your first invoice.' : `No ${filter.replace('_', ' ')} invoices found.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onViewDetails={setSelectedInvoice}
                    onEdit={handleEditInvoice}
                  />
                ))}
              </div>
            )}
          </>
        ) : currentTab === 'creditnotes' ? (
          <CreditNoteManager
            creditNotes={creditNotes}
            invoices={invoices}
            onApplyCreditNote={applyCreditNoteToInvoice}
            onAddCreditNote={addCreditNote}
          />
        ) : (
          <FoodTraceability
            invoices={invoices}
          />
        )}
      </div>

      {/* Modals */}
      {showScanner && (
        <InvoiceScanner
          onScanComplete={handleScanComplete}
          onCancel={() => setShowScanner(false)}
        />
      )}

      {selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onUpdateItem={handleUpdateItem}
          onEdit={handleEditInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {editingInvoice && (
        <InvoiceEditor
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => setEditingInvoice(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;