import React, { useState, useCallback, useEffect } from 'react';
import { Page, BusinessType, BrandVoice, Language, User } from './types';
import Dashboard from './components/Dashboard';
import EditPageModal from './components/EditPageModal';
import WebhookTestModal from './components/WebhookTestModal';
import { Header } from './components/Header';
import AddPageModal from './components/AddPageModal';
import HttpsGuard from './components/HttpsGuard';
import LoggedOutGuide from './components/LoggedOutGuide';

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isWebhookModalOpen, setWebhookModalOpen] = useState<boolean>(false);
  const [isAddPageModalOpen, setAddPageModalOpen] = useState<boolean>(false);
  const [isFbSdkReady, setIsFbSdkReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const fetchUserData = useCallback(async () => {
    window.FB.api('/me?fields=name,picture.type(large)', (userInfo: any) => {
      if (userInfo && !userInfo.error) {
        setUser({
          id: userInfo.id,
          name: userInfo.name,
          pictureUrl: userInfo.picture.data.url,
        });
      }
    });

    window.FB.api('/me/accounts', (pagesResponse: any) => {
      if (pagesResponse && !pagesResponse.error) {
        const fetchedPages: Page[] = pagesResponse.data.map((p: any) => ({
          pageId: p.id,
          pageName: p.name,
          accessToken: p.access_token,
          businessType: BusinessType.OTHER,
          brandVoice: BrandVoice.FRIENDLY,
          language: Language.ENGLISH,
          services: [],
          active: false,
          updatedAt: new Date(),
        }));
        setPages(fetchedPages);
      } else {
        // Could be a permissions issue, clear pages
        setPages([]);
      }
      setIsLoggedIn(true);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '2471134669825848',
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setIsFbSdkReady(true);
      
      window.FB.getLoginStatus(function(response: any) {
        if (response.status === 'connected') {
          fetchUserData();
        } else {
          setIsLoggedIn(false);
          setIsLoading(false);
        }
      });
    };

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
     
  }, [fetchUserData]);
  
  const handleLogin = useCallback(() => {
    if (!isFbSdkReady || !window.FB) return;
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          setIsLoading(true);
          fetchUserData();
        }
      },
      { 
        scope: 'pages_show_list,pages_manage_metadata,pages_messaging',
        auth_type: 'rerequest'
      }
    );
  }, [isFbSdkReady, fetchUserData]);
  
  const handleLogout = useCallback(() => {
     if (!isFbSdkReady || !window.FB) return;
     window.FB.logout(() => {
        setUser(null);
        setPages([]);
        setIsLoggedIn(false);
     });
  }, [isFbSdkReady]);


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
    const newPagesWithDefaults = newPages.map(p => ({
        ...p,
        businessType: BusinessType.OTHER,
        brandVoice: BrandVoice.FRIENDLY,
        language: Language.ENGLISH,
        services: [],
        active: false,
        updatedAt: new Date(),
    }));
    setPages(prevPages => {
        const existingPageIds = new Set(prevPages.map(page => page.pageId));
        const trulyNewPages = newPagesWithDefaults.filter(page => !existingPageIds.has(page.pageId));
        return [...prevPages, ...trulyNewPages];
    });
    setAddPageModalOpen(false);
};

  const handleCloseModal = () => {
    setEditingPage(null);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }

    if (!isLoggedIn) {
      return <LoggedOutGuide onLogin={handleLogin} isSdkReady={isFbSdkReady} />;
    }
    
    return (
      <Dashboard 
        pages={pages} 
        onToggleActive={handleToggleActive} 
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        onAddNewPage={() => setAddPageModalOpen(true)}
      />
    );
  }

  return (
    <HttpsGuard>
      <div className="min-h-screen bg-gray-900 font-sans">
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onTestWebhook={() => setWebhookModalOpen(true)} 
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
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
        {isLoggedIn && isAddPageModalOpen && (
          <AddPageModal
              isOpen={isAddPageModalOpen}
              onClose={() => setAddPageModalOpen(false)}
              onAddPages={handleAddPages}
              connectedPageIds={pages.map(p => p.pageId)}
          />
        )}
      </div>
    </HttpsGuard>
  );
};

export default App;