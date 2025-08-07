import React, { useState, useRef } from 'react';
import { InvoiceItem, DamageReport } from '../types/invoice';

interface DamageReportDialogProps {
  item: InvoiceItem;
  onSave: (itemId: string, damageReport: DamageReport) => void;
  onCancel: () => void;
}

const DamageReportDialog: React.FC<DamageReportDialogProps> = ({
  item,
  onSave,
  onCancel
}) => {
  const [reason, setReason] = useState(item.damageReport?.reason || '');
  const [severity, setSeverity] = useState<'minor' | 'major' | 'total_loss'>(
    item.damageReport?.severity || 'minor'
  );
  const [photo, setPhoto] = useState<string | undefined>(item.damageReport?.photo);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    const damageReport: DamageReport = {
      reported: true,
      reason: reason.trim(),
      photo,
      reportedAt: new Date(),
      severity
    };
    onSave(item.id, damageReport);
  };

  const handleRemoveDamageReport = () => {
    const damageReport: DamageReport = {
      reported: false
    };
    onSave(item.id, damageReport);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'total_loss': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📸</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Report Damaged Goods
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Document damage or poor quality issues with photos
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
          {/* Item Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Item Details</h3>
            <div className="text-sm text-gray-600">
              <div><strong>Description:</strong> {item.description}</div>
              <div><strong>Quantity:</strong> {item.quantity}</div>
              <div><strong>Batch Code:</strong> {item.batchCode || 'N/A'}</div>
              {item.deliveryDate && (
                <div><strong>Delivered:</strong> {item.deliveryDate.toLocaleDateString()}</div>
              )}
            </div>
          </div>

          {/* Severity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Damage Severity
            </label>
            <div className="space-y-2">
              {(['minor', 'major', 'total_loss'] as const).map((sev) => (
                <label key={sev} className="flex items-center">
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={severity === sev}
                    onChange={(e) => setSeverity(e.target.value as typeof severity)}
                    className="mr-3 text-blue-600"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(sev)}`}>
                    {sev === 'total_loss' ? 'Total Loss' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {sev === 'minor' && 'Small defects, still usable'}
                    {sev === 'major' && 'Significant damage, limited usability'}
                    {sev === 'total_loss' && 'Completely unusable, full replacement needed'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Damage Description
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the damage, poor quality, or issues found..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photo Evidence
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {!photo ? (
              <div className="space-y-3">
                <button
                  onClick={handleCameraCapture}
                  disabled={isUploading}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {isUploading ? 'Uploading...' : 'Take a photo of the damaged goods'}
                    </p>
                  </div>
                </button>
                
                <div className="text-center text-gray-500">or</div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Choose from Gallery
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt="Damage evidence"
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setPhoto(undefined)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Remove Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Replace Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Damage Report Info */}
          {item.damageReport?.reported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-yellow-800">Existing damage report</span>
              </div>
              <p className="text-sm text-yellow-700">
                This item already has a damage report from {item.damageReport.reportedAt?.toLocaleDateString()}.
                You can update it or remove it completely.
              </p>
            </div>
          )}
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
            
            {item.damageReport?.reported && (
              <button
                onClick={handleRemoveDamageReport}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Remove Damage Report
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={!reason.trim()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.damageReport?.reported ? 'Update' : 'Report'} Damage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageReportDialog;