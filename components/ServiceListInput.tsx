
import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from './icons';

interface ServiceListInputProps {
  initialServices: string[];
  onChange: (services: string[]) => void;
}

const ServiceListInput: React.FC<ServiceListInputProps> = ({ initialServices, onChange }) => {
  const [services, setServices] = useState<string[]>(initialServices);

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
    onChange(newServices);
  };

  const addService = () => {
    const newServices = [...services, ''];
    setServices(newServices);
    onChange(newServices);
  };

  const removeService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
    onChange(newServices);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Services / FAQs</label>
      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={service}
              onChange={(e) => handleServiceChange(index, e.target.value)}
              placeholder={`Service #${index + 1}`}
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={() => removeService(index)}
              className="p-2 text-gray-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
            >
              <TrashIcon className="w-5 h-5 text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addService}
        className="mt-3 flex items-center px-3 py-2 text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-md transition-colors"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Service
      </button>
    </div>
  );
};

export default ServiceListInput;
