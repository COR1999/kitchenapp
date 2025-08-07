import React, { useState } from 'react';
import { Invoice } from '../types/invoice';
import InvoiceCard from './InvoiceCard';
import InvoiceDetails from './InvoiceDetails';
import InvoiceScanner from './InvoiceScanner';
import { useInvoices } from '../hooks/useInvoices';

const Dashboard: React.FC = () => {
  const { invoices, loading, addInvoice, updateInvoiceItem, getInvoiceStats } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'partially_delivered' | 'fully_delivered' | 'overdue'>('all');

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
          <button
            onClick={() => setShowScanner(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Scan Invoice</span>
          </button>
        </div>

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
            { key: 'fully_delivered', label: 'Complete' },
            { key: 'overdue', label: 'Overdue' }
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
              />
            ))}
          </div>
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
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;