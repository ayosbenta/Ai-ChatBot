import React, { useState, useCallback, useEffect } from 'react';
import { Page, BusinessType, BrandVoice, Language } from './types';
import Dashboard from './components/Dashboard';
import EditPageModal from './components/EditPageModal';
import WebhookTestModal from './components/WebhookTestModal';
import { Header } from './components/Header';
import AddPageModal from './components/AddPageModal';
import HttpsGuard from './components/HttpsGuard';

const MOCK_PAGES: Page[] = [
  {
    pageId: '1001',
    pageName: 'Starlight Gadgets',
    accessToken: 'EA...1',
    businessType: BusinessType.ECOMMERCE,
    brandVoice: BrandVoice.FRIENDLY,
    active: true,
    services: ['Smartphone Sales', 'Laptop Repairs', 'Accessory Bundles'],
    language: Language.ENGLISH,
    updatedAt: new Date(),
  },
  {
    pageId: '1002',
    pageName: 'Wanderlust Travels',
    accessToken: 'EA...2',
    businessType: BusinessType.TRAVEL,
    brandVoice: BrandVoice.SALES_ORIENTED,
    active: false,
    services: ['Tour Packages', 'Flight Booking', 'Hotel Reservations'],
    language: Language.ENGLISH,
    updatedAt: new Date('2023-10-26T10:00:00Z'),
  },
  {
    pageId: '1003',
    pageName: 'SpeedyNet ISP',
    accessToken: 'EA...3',
    businessType: BusinessType.ISP,
    brandVoice: BrandVoice.FORMAL,
    active: true,
    services: ['Fiber Internet Plans', 'Technical Support', 'Billing Inquiries'],
    language: Language.TAGALOG,
    updatedAt: new Date('2023-11-15T14:30:00Z'),
  },
  {
    pageId: '1004',
    pageName: 'Manila Bites',
    accessToken: 'EA...4',
    businessType: BusinessType.RESTAURANT,
    brandVoice: BrandVoice.TAGLISH,
    active: true,
    services: ['Food Delivery', 'Table Reservations', 'Catering'],
    language: Language.TAGALOG,
    updatedAt: new Date(),
  },
];


const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(MOCK_PAGES);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isWebhookModalOpen, setWebhookModalOpen] = useState<boolean>(false);
  const [isAddPageModalOpen, setAddPageModalOpen] = useState<boolean>(false);
  const [isFbSdkReady, setIsFbSdkReady] = useState<boolean>(false);

  useEffect(() => {
    // Define the fbAsyncInit function FIRST
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '2471134669825848',
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setIsFbSdkReady(true); // Signal that the SDK is ready
    };

    // THEN, load the SDK script
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       if(fjs && fjs.parentNode) {
         fjs.parentNode.insertBefore(js, fjs);
       } else {
         d.body.appendChild(js);
       }
     }(document, 'script', 'facebook-jssdk'));
     
  }, []);

  const handleToggleActive = useCallback((pageId: string) => {
    setPages(prevPages =>
      prevPages.map(p =>
        p.pageId === pageId ? { ...p, active: !p.active, updatedAt: new Date() } : p
      )
    );
  }, []);

  const handleEdit = useCallback((page: Page) => {
    setEditingPage(page);
  }, []);
  
  const handleRefresh = (pageId: string) => {
    // In a real app, this would trigger an API call to refresh the token.
    // Here, we'll just show an alert.
    const page = pages.find(p => p.pageId === pageId);
    alert(`Token refreshed for ${page?.pageName}! (Simulation)`);
  };

  const handleSave = (updatedPage: Page) => {
    setPages(prevPages =>
      prevPages.map(p => (p.pageId === updatedPage.pageId ? { ...updatedPage, updatedAt: new Date() } : p))
    );
    setEditingPage(null);
  };
  
  const handleAddPages = (newPages: Page[]) => {
    setPages(prevPages => [...prevPages, ...newPages]);
    setAddPageModalOpen(false);
  };

  const handleCloseModal = () => {
    setEditingPage(null);
  };

  return (
    <HttpsGuard>
      <div className="min-h-screen bg-gray-900 font-sans">
        <Header onTestWebhook={() => setWebhookModalOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Dashboard 
            pages={pages} 
            onToggleActive={handleToggleActive} 
            onEdit={handleEdit}
            onRefresh={handleRefresh}
            onAddNewPage={() => setAddPageModalOpen(true)}
          />
        </main>
        {editingPage && (
          <EditPageModal
            isOpen={!!editingPage}
            onClose={handleCloseModal}
            page={editingPage}
            onSave={handleSave}
          />
        )}
        {isWebhookModalOpen && (
          <WebhookTestModal 
            isOpen={isWebhookModalOpen}
            onClose={() => setWebhookModalOpen(false)}
          />
        )}
        {isAddPageModalOpen && (
          <AddPageModal
              isOpen={isAddPageModalOpen}
              onClose={() => setAddPageModalOpen(false)}
              onAddPages={handleAddPages}
              isFbSdkReady={isFbSdkReady}
              connectedPageIds={pages.map(p => p.pageId)}
          />
        )}
      </div>
    </HttpsGuard>
  );
};

export default App;