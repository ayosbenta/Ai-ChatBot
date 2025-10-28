import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { CogIcon } from './icons';

interface UserProfileProps {
    user: User;
    onLogout: () => void;
    onTestWebhook: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onTestWebhook }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 p-1.5 rounded-full transition-colors"
            >
                <img className="h-8 w-8 rounded-full" src={user.pictureUrl} alt="User profile" />
                <span className="hidden sm:block text-sm font-medium text-white pr-2">{user.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onTestWebhook();
                                setIsOpen(false);
                            }}
                            className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <CogIcon className="w-5 h-5" />
                            <span>Webhook Setup</span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-300 hover:bg-gray-700 hover:text-red-300 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
