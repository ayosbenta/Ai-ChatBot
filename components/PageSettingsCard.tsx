
import React from 'react';
import { Page } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { EditIcon, RefreshIcon, LanguageIcon, BusinessIcon, VoiceIcon, ServicesIcon, PromptIcon } from './icons';

interface PageSettingsCardProps {
  page: Page;
  onToggleActive: (pageId: string) => void;
  onEdit: (page: Page) => void;
  onRefresh: (pageId: string) => void;
}

const PageSettingsCard: React.FC<PageSettingsCardProps> = ({ page, onToggleActive, onEdit, onRefresh }) => {
    
  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };
  
  const hasCustomInstructions = page.customInstructions && page.customInstructions.trim() !== '';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col justify-between">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{page.pageName}</h3>
            <p className="text-sm text-gray-400">ID: {page.pageId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${page.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {page.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center">
              {hasCustomInstructions ? <PromptIcon className="w-4 h-4 mr-2 text-gray-400" /> : <VoiceIcon className="w-4 h-4 mr-2 text-gray-400" />}
              <span className="italic truncate">
                {hasCustomInstructions ? `"${page.customInstructions}"` : page.brandVoice}
              </span>
            </div>
            <div className="flex items-center"><BusinessIcon className="w-4 h-4 mr-2 text-gray-400" /><span>{page.businessType}</span></div>
            <div className="flex items-center"><LanguageIcon className="w-4 h-4 mr-2 text-gray-400" /><span>Language: {page.language.toUpperCase()}</span></div>
            <div className="flex items-start"><ServicesIcon className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                    {page.services.slice(0, 3).map(service => (
                        <span key={service} className="text-xs bg-gray-700 px-2 py-1 rounded">{service}</span>
                    ))}
                    {page.services.length > 3 && <span className="text-xs bg-gray-700 px-2 py-1 rounded">...</span>}
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-4 rounded-b-xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <ToggleSwitch
              enabled={page.active}
              onChange={() => onToggleActive(page.pageId)}
            />
            <button onClick={() => onEdit(page)} className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Edit Settings">
                <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onRefresh(page.pageId)} className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Refresh Token">
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
        <p className="text-xs text-gray-500">Updated {timeAgo(page.updatedAt)}</p>
      </div>
    </div>
  );
};

export default PageSettingsCard;