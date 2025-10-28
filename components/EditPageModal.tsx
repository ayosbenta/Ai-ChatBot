
import React, { useState, useEffect } from 'react';
import { Page, BusinessType, BrandVoice, Language } from '../types';
import ServiceListInput from './ServiceListInput';

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page;
  onSave: (page: Page) => void;
}

const EditPageModal: React.FC<EditPageModalProps> = ({ isOpen, onClose, page, onSave }) => {
  const [formData, setFormData] = useState<Page>(page);

  useEffect(() => {
    setFormData(page);
  }, [page]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServicesChange = (services: string[]) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Edit Settings</h2>
          <p className="text-gray-400">{page.pageName}</p>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">Business Type</label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {Object.values(BusinessType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            
            <div>
              <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-300 mb-1">Brand Voice</label>
              <select
                id="brandVoice"
                name="brandVoice"
                value={formData.brandVoice}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {Object.values(BrandVoice).map(voice => <option key={voice} value={voice}>{voice}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {Object.values(Language).map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
              </select>
            </div>

            <ServiceListInput initialServices={formData.services} onChange={handleServicesChange} />
          </div>
          <div className="px-6 py-4 bg-gray-900/50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPageModal;
