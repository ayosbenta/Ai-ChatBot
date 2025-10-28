
import React from 'react';
import { CodeBracketIcon } from './icons';

interface WebhookTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebhookTestModal: React.FC<WebhookTestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const webhookUrl = "https://your-backend-url.com/webhook";
  const verifyToken = "YOUR_SECRET_VERIFY_TOKEN";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Webhook Setup & Test</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            To connect your Facebook App to this system, configure your Messenger webhook settings in the Meta Developer Portal with the following details.
          </p>
          
          <div>
            <label className="text-sm font-medium text-gray-400">Callback URL</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 sm:text-sm">
                <CodeBracketIcon className="w-5 h-5"/>
              </span>
              <input type="text" readOnly value={webhookUrl} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-900 border-gray-600 text-gray-300 sm:text-sm"/>
            </div>
          </div>
          
           <div>
            <label className="text-sm font-medium text-gray-400">Verify Token</label>
            <div className="mt-1 flex rounded-md shadow-sm">
               <input type="text" readOnly value={verifyToken} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md bg-gray-900 border-gray-600 text-gray-300 sm:text-sm"/>
            </div>
          </div>

          <div className="pt-2">
             <h3 className="font-semibold text-white">Required Subscriptions</h3>
             <p className="text-sm text-gray-400">Subscribe to these events for the chatbot to function correctly:</p>
             <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                <li><code className="bg-gray-700 text-xs p-1 rounded">messages</code></li>
                <li><code className="bg-gray-700 text-xs p-1 rounded">messaging_postbacks</code></li>
             </ul>
          </div>
          
        </div>
        <div className="px-6 py-4 bg-gray-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebhookTestModal;
