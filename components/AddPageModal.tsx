import React, { useState, useEffect } from 'react';
import { Page, BusinessType, BrandVoice, Language } from '../types';
import { RobotIcon } from './icons';

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPages: (pages: Page[]) => void;
  connectedPageIds: string[];
}

interface FetchedPageData {
    id: string;
    name: string;
    access_token: string;
}

const AddPageModal: React.FC<AddPageModalProps> = ({ isOpen, onClose, onAddPages, connectedPageIds }) => {
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [fetchedPages, setFetchedPages] = useState<FetchedPageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open and fetch pages
      setSelectedPageIds(new Set());
      setFetchedPages([]);
      setError(null);
      fetchPages();
    }
  }, [isOpen, connectedPageIds]);


  const fetchPages = () => {
    if (!window.FB) {
        setError("Facebook SDK not available.");
        return;
    }
    setIsLoadingPages(true);
    window.FB.api('/me/accounts', (response: any) => {
      if (response && !response.error) {
        const availablePages = response.data.filter(
            (page: FetchedPageData) => !connectedPageIds.includes(page.id)
        );
        setFetchedPages(availablePages);
      } else {
        setError(response.error?.message || 'Failed to fetch pages. You may need to re-authenticate.');
        setFetchedPages([]);
      }
      setIsLoadingPages(false);
    });
  };

  const handleToggleSelection = (pageId: string) => {
    setSelectedPageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const selectedPagesData = fetchedPages.filter(p => selectedPageIds.has(p.id));
    const newPages: Page[] = selectedPagesData.map(p => ({
        pageId: p.id,
        pageName: p.name,
        accessToken: p.access_token,
        businessType: BusinessType.OTHER,
        brandVoice: BrandVoice.FRIENDLY,
        language: Language.ENGLISH,
        services: [],
        active: false,
        customInstructions: '',
        updatedAt: new Date(),
    }));
    onAddPages(newPages);
  };
  
  const renderPageList = () => {
      if (isLoadingPages) {
          return <div className="text-center py-8 text-gray-400">Loading your pages...</div>;
      }
      if (error) {
          return <div className="text-center py-8 text-red-400">{error}</div>;
      }
      if (fetchedPages.length > 0) {
        return fetchedPages.map(page => {
          const isSelected = selectedPageIds.has(page.id);
          return (
            <div
              key={page.id}
              onClick={() => handleToggleSelection(page.id)}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected ? 'bg-cyan-500/20 ring-2 ring-cyan-500' : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-600 rounded-full">
                  {/* Using a generic icon as page pictures aren't fetched by default */}
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-white">{page.name}</p>
                  <p className="text-sm text-gray-400">ID: {page.id}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-cyan-600 border-cyan-500' : 'border-gray-500'}`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          );
        });
      }
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No new pages found to connect.</p>
          <p className="text-sm text-gray-500">Ensure you have granted permissions and are an admin of the desired Facebook Page.</p>
        </div>
      );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Connect Facebook Pages</h2>
          <p className="text-gray-400">Select the pages you want to manage.</p>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-3">
            {renderPageList()}
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
            type="button"
            onClick={handleSubmit}
            disabled={selectedPageIds.size === 0 || isLoadingPages}
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Connect {selectedPageIds.size > 0 ? `(${selectedPageIds.size})` : ''} Page{selectedPageIds.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPageModal;