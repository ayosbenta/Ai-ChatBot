import React from 'react';
import { FacebookIcon, RobotIcon, PlusCircleIcon, VoiceIcon, ChartBarIcon } from './icons';

interface LoggedOutGuideProps {
    onLogin: () => void;
    isSdkReady: boolean;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10">
        <div className="flex items-center space-x-4">
            <div className="bg-cyan-500/10 p-3 rounded-full">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);


const LoggedOutGuide: React.FC<LoggedOutGuideProps> = ({ onLogin, isSdkReady }) => {
    return (
        <div className="max-w-4xl mx-auto text-center py-12">
            <RobotIcon className="w-20 h-20 text-cyan-400 mx-auto" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Welcome to the AI Chatbot Command Center
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
                Your central hub for creating, managing, and deploying intelligent, Gemini-powered chatbots across all of your Facebook Pages.
                Turn inquiries into satisfaction with a fully automated, customizable assistant.
            </p>
            <div className="mt-10">
                <button
                    onClick={onLogin}
                    disabled={!isSdkReady}
                    className="flex items-center justify-center mx-auto space-x-3 w-full max-w-xs px-4 py-3 text-lg font-bold text-white bg-[#1877F2] rounded-md hover:bg-[#166ee1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#1877F2] transition-colors disabled:bg-gray-500 disabled:cursor-wait"
                >
                    <FacebookIcon className="w-7 h-7" />
                    <span>{isSdkReady ? 'Login with Facebook to Start' : 'Initializing...'}</span>
                </button>
            </div>
            
            <div className="mt-16 text-left space-y-8">
                <FeatureCard 
                    icon={<PlusCircleIcon className="w-7 h-7 text-cyan-300" />} 
                    title="Connect Unlimited Pages" 
                    description="Securely link all your Facebook Pages in seconds and manage them from one unified dashboard." 
                />
                 <FeatureCard 
                    icon={<VoiceIcon className="w-7 h-7 text-cyan-300" />} 
                    title="Customize with Gemini AI" 
                    description="Define the unique brand voice, business type, and services for each page to provide tailored, intelligent responses." 
                />
                 <FeatureCard 
                    icon={<ChartBarIcon className="w-7 h-7 text-cyan-300" />} 
                    title="Activate with a Click" 
                    description="Instantly toggle your AI chatbots on or off for any page, giving you complete control over your automated messaging." 
                />
            </div>
        </div>
    );
};

export default LoggedOutGuide;
