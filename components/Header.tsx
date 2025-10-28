import React from 'react';
import { RobotIcon } from './icons';
import { User } from '../types';
import UserProfile from './UserProfile';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onTestWebhook: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onTestWebhook }) => {
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
                    
                    {user && (
                        <UserProfile 
                            user={user} 
                            onLogout={onLogout} 
                            onTestWebhook={onTestWebhook} 
                        />
                    )}
                </div>
            </div>
        </header>
    );
}