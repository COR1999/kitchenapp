import React, { useState, useMemo } from 'react';
import { Invoice } from '../types/invoice';
import { DateUtils } from '../utils/dateUtils';

interface TraceabilityRecord {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  supplier: string;
  itemId: string;
  itemName: string;
  batchCode?: string;
  quantity: number;
  deliveryDate?: Date;
  delivered: boolean;
}

interface FoodTraceabilityProps {
  invoices: Invoice[];
  onUpdateInvoiceItem?: (invoiceId: string, itemId: string, updates: { batchCode: string }) => void;
}

const FoodTraceability: React.FC<FoodTraceabilityProps> = ({ invoices, onUpdateInvoiceItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'with_batch' | 'without_batch'>('all');
  const [weekFilter, setWeekFilter] = useState<string>('current'); // Default to current week
  const [sortBy, setSortBy] = useState<'date' | 'batch_code' | 'item_name' | 'supplier'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingBatch, setEditingBatch] = useState<{ invoiceId: string; itemId: string } | null>(null);
  const [batchCodeInput, setBatchCodeInput] = useState('');

  // Convert invoices to traceability records
  const traceabilityRecords = useMemo(() => {
    const records: TraceabilityRecord[] = [];
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        records.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.date,
          supplier: invoice.supplier,
          itemId: item.id,
          itemName: item.description,
          batchCode: item.batchCode,
          quantity: item.quantity,
          deliveryDate: item.deliveryDate,
          delivered: item.delivered
        });
      });
    });

    return records;
  }, [invoices]);

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = traceabilityRecords;

    // Apply week filter
    if (weekFilter !== 'all') {
      const weekRange = DateUtils.getWeekRangeByValue(weekFilter);
      if (weekRange) {
        filtered = filtered.filter(record => 
          DateUtils.isDateInWeek(record.invoiceDate, weekRange.start)
        );
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.itemName.toLowerCase().includes(term) ||
        record.batchCode?.toLowerCase().includes(term) ||
        record.invoiceNumber.toLowerCase().includes(term) ||
        record.supplier.toLowerCase().includes(term)
      );
    }

    // Apply batch code filter
    switch (filterBy) {
      case 'with_batch':
        filtered = filtered.filter(record => record.batchCode && record.batchCode.trim() !== '');
        break;
      case 'without_batch':
        filtered = filtered.filter(record => !record.batchCode || record.batchCode.trim() === '');
        break;
    }

    // Sort records
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.invoiceDate.getTime() - b.invoiceDate.getTime();
          break;
        case 'batch_code':
          const aBatch = a.batchCode || '';
          const bBatch = b.batchCode || '';
          comparison = aBatch.localeCompare(bBatch);
          break;
        case 'item_name':
          comparison = a.itemName.localeCompare(b.itemName);
          break;
        case 'supplier':
          comparison = a.supplier.localeCompare(b.supplier);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [traceabilityRecords, searchTerm, filterBy, weekFilter, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleAddBatchCode = (invoiceId: string, itemId: string, currentBatchCode?: string) => {
    setEditingBatch({ invoiceId, itemId });
    setBatchCodeInput(currentBatchCode || '');
  };

  const handleSaveBatchCode = () => {
    if (editingBatch && onUpdateInvoiceItem && batchCodeInput.trim()) {
      onUpdateInvoiceItem(editingBatch.invoiceId, editingBatch.itemId, { 
        batchCode: batchCodeInput.trim() 
      });
      setEditingBatch(null);
      setBatchCodeInput('');
    }
  };

  const handleCancelBatchEdit = () => {
    setEditingBatch(null);
    setBatchCodeInput('');
  };

  const exportToCSV = () => {
    const csvHeaders = ['Invoice Number', 'Invoice Date', 'Supplier', 'Item Name', 'Batch Code', 'Quantity', 'Delivered', 'Delivery Date'];
    const csvData = filteredAndSortedRecords.map(record => [
      record.invoiceNumber,
      record.invoiceDate.toLocaleDateString(),
      record.supplier,
      record.itemName,
      record.batchCode || 'N/A',
      record.quantity.toString(),
      record.delivered ? 'Yes' : 'No',
      record.deliveryDate ? record.deliveryDate.toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `food-traceability-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const totalItems = traceabilityRecords.length;
    const itemsWithBatch = traceabilityRecords.filter(r => r.batchCode && r.batchCode.trim() !== '').length;
    const deliveredItems = traceabilityRecords.filter(r => r.delivered).length;
    
    return {
      totalItems,
      itemsWithBatch,
      deliveredItems,
      batchCoverage: totalItems > 0 ? Math.round((itemsWithBatch / totalItems) * 100) : 0,
      deliveryRate: totalItems > 0 ? Math.round((deliveredItems / totalItems) * 100) : 0
    };
  }, [traceabilityRecords]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Food Traceability</h2>
          <p className="text-gray-600 mt-1">Track batch codes and product origins for food safety compliance</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Total Items</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">With Batch Code</div>
          <div className="text-2xl font-bold text-blue-600">{stats.itemsWithBatch}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Batch Coverage</div>
          <div className="text-2xl font-bold text-blue-600">{stats.batchCoverage}%</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{stats.deliveredItems}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Delivery Rate</div>
          <div className="text-2xl font-bold text-green-600">{stats.deliveryRate}%</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search item name, batch code, invoice..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 text-sm"
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              {DateUtils.getWeekRanges(8).map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label} ({DateUtils.formatWeekRange(week.start, week.end)})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Batch Code
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Items</option>
              <option value="with_batch">With Batch Code</option>
              <option value="without_batch">Missing Batch Code</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="item_name_asc">Item Name (A-Z)</option>
              <option value="item_name_desc">Item Name (Z-A)</option>
              <option value="batch_code_asc">Batch Code (A-Z)</option>
              <option value="batch_code_desc">Batch Code (Z-A)</option>
              <option value="supplier_asc">Supplier (A-Z)</option>
              <option value="supplier_desc">Supplier (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Traceability Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Traceability Records ({filteredAndSortedRecords.length})
          </h3>
        </div>
        
        {filteredAndSortedRecords.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filters.' : 'Start by adding invoices with batch codes.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedRecords.map((record, index) => (
                  <tr key={`${record.invoiceId}-${record.itemId}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {record.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {record.invoiceDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {record.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.itemName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingBatch?.invoiceId === record.invoiceId && editingBatch?.itemId === record.itemId ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={batchCodeInput}
                            onChange={(e) => setBatchCodeInput(e.target.value)}
                            placeholder="Enter batch code"
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveBatchCode}
                            disabled={!batchCodeInput.trim()}
                            className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                            title="Save batch code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelBatchEdit}
                            className="text-gray-400 hover:text-gray-600"
                            title="Cancel"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : record.batchCode ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.batchCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {record.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record.delivered ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                          {record.deliveryDate && (
                            <span className="text-xs text-gray-500 mt-1">
                              {record.deliveryDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {onUpdateInvoiceItem && (editingBatch?.invoiceId !== record.invoiceId || editingBatch?.itemId !== record.itemId) && (
                        <button
                          onClick={() => handleAddBatchCode(record.invoiceId, record.itemId, record.batchCode)}
                          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                            record.batchCode 
                              ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                              : 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                          }`}
                          title={record.batchCode ? 'Edit batch code' : 'Add batch code'}
                        >
                          {record.batchCode ? 'Edit' : 'Add Batch'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodTraceability;