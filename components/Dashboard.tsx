import React from 'react';
import { Page } from '../types';
import PageSettingsCard from './PageSettingsCard';
import { ChartBarIcon, LinkIcon, PlusCircleIcon } from './icons';

interface DashboardProps {
  pages: Page[];
  onToggleActive: (pageId: string) => void;
  onEdit: (page: Page) => void;
  onRefresh: (pageId: string) => void;
  onAddNewPage: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pages, onToggleActive, onEdit, onRefresh, onAddNewPage }) => {
  const activePages = pages.filter(p => p.active).length;
  const totalPages = pages.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Manage and monitor all your Facebook Page chatbots.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">Total Connected Pages</dt>
                  <dd className="text-3xl font-semibold text-white">{totalPages}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">Active Chatbots</dt>
                  <dd className="text-3xl font-semibold text-white">{activePages}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Page Configuration</h2>
            <button
                onClick={onAddNewPage}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
            >
                <PlusCircleIcon className="w-5 h-5" />
                <span>Connect New Page</span>
            </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pages.map(page => (
            <PageSettingsCard
              key={page.pageId}
              page={page}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;