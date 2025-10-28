
import React from 'react';
import { RobotIcon, CogIcon } from './icons';

interface HeaderProps {
    onTestWebhook: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTestWebhook }) => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 ring-1 ring-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <RobotIcon className="h-8 w-8 text-cyan-400" />
                        <h1 className="text-xl font-bold text-white tracking-wider">
                           AI Chatbot Command Center
                        </h1>
                    </div>
                    <button 
                        onClick={onTestWebhook}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-700/50 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                    >
                        <CogIcon className="w-5 h-5" />
                        <span>Webhook Setup</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
