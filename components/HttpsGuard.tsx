import React from 'react';

const HttpsGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // window.isSecureContext is the most reliable way to check if the browser
  // considers the current environment secure enough for sensitive APIs like Facebook Login.
  // It must be served over HTTPS, with some exceptions for localhost.
  if (window.isSecureContext) {
    return <>{children}</>;
  }

  // If the context is not secure, display a helpful error message.
  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-3xl text-center bg-red-900/50 border border-red-500 rounded-lg p-6 sm:p-8 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-300">Security Requirement Not Met: HTTPS Required</h1>
            <p className="mt-4 text-md sm:text-lg text-red-200">
                You are seeing this message because the application is not running in a "secure context".
            </p>
            <p className="mt-4 text-red-200">
                Facebook's security policy strictly requires that any page using its Login feature must be served over a secure (HTTPS) connection. This is to protect user data. Your browser has determined that the current environment does not meet this standard, which is why you are likely seeing errors like <strong className="font-semibold text-white">"The method FB.login can no longer be called from http pages."</strong>
            </p>
            <div className="mt-6 text-left bg-gray-800 p-4 rounded-lg">
                <p className="font-semibold text-white">How to fix this:</p>
                <ul className="mt-2 space-y-2 list-disc list-inside text-red-200">
                    <li>
                        <strong>If you are developing locally:</strong> You must configure your development server to use HTTPS. Many modern tools (like Vite, Next.js, or Create React App) have built-in commands or configuration options to enable HTTPS for local development.
                    </li>
                    <li>
                        <strong>If this application is deployed:</strong> Ensure your hosting provider has a valid SSL certificate installed and is configured to force all traffic over HTTPS.
                    </li>
                     <li>
                        <strong>If running in a sandboxed environment (like an online IDE or platform):</strong> The platform itself may not be providing a secure context for embedded applications, even if the main URL is HTTPS. Please check the platform's documentation or contact their support.
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default HttpsGuard;
