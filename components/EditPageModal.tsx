import React, { useState, useEffect, useRef } from 'react';
import { Page, BusinessType, BrandVoice, Language, ChatMessage } from '../types';
import ServiceListInput from './ServiceListInput';
import { GoogleGenAI } from '@google/genai';
import { RobotIcon, SendIcon } from './icons';

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page;
  onSave: (page: Page) => void;
}

const EditPageModal: React.FC<EditPageModalProps> = ({ isOpen, onClose, page, onSave }) => {
  const [formData, setFormData] = useState<Page>(page);
  const [previewMessages, setPreviewMessages] = useState<ChatMessage[]>([]);
  const [previewInput, setPreviewInput] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(page);
    setPreviewMessages([
      { role: 'model', content: `Hello! I'm the AI agent for ${page.pageName}. Send me a message to see how I'd respond based on the current settings.` }
    ]);
  }, [page]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previewMessages]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServicesChange = (services: string[]) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSendPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewInput.trim() || isPreviewLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: previewInput };
    setPreviewMessages(prev => [...prev, userMessage]);
    setPreviewInput('');
    setIsPreviewLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const servicesList = formData.services.length > 0 ? formData.services.map(s => `- ${s}`).join('\n') : 'No specific services listed.';
      
      const systemInstruction = formData.customInstructions.trim() !== ''
        ? formData.customInstructions
        : `You are a helpful assistant for a Facebook Page. Your tone should be ${formData.brandVoice}.`;

      const prompt = `${systemInstruction}

Here is some additional context about the page you are representing:
- Page Name: ${page.pageName}
- Business Type: ${formData.businessType}
- Language to respond in: ${formData.language.toUpperCase()}
- Key Services/FAQs:
${servicesList}

Now, please respond to the following user message:
User Message: "${userMessage.content}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setPreviewMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: ChatMessage = { role: 'error', content: 'Sorry, I encountered an error. Please check the API key and try again.' };
      setPreviewMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Configure AI Chatbot Agent</h2>
          <p className="text-gray-400">{page.pageName}</p>
        </div>
        
        <div className="flex-grow overflow-y-auto md:grid md:grid-cols-2 md:gap-6">
          {/* Left Pane: Configuration */}
          <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-300 mb-1">Custom Instructions (System Prompt)</label>
                 <textarea
                  id="customInstructions"
                  name="customInstructions"
                  value={formData.customInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., You are a witty assistant for a high-end sneaker store. Always end your responses with a cool sneaker-related pun."
                />
                <p className="text-xs text-gray-400 mt-1">Define the core personality and rules for your AI. If left blank, the Brand Voice below will be used.</p>
              </div>
               <div>
                <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-300 mb-1">Brand Voice (Fallback)</label>
                <select id="brandVoice" name="brandVoice" value={formData.brandVoice} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {Object.values(BrandVoice).map(voice => <option key={voice} value={voice}>{voice}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">Business Type</label>
                <select id="businessType" name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {Object.values(BusinessType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                <select id="language" name="language" value={formData.language} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {Object.values(Language).map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
                </select>
              </div>
              <ServiceListInput initialServices={formData.services} onChange={handleServicesChange} />
            </div>
            <div className="mt-auto px-6 py-4 bg-gray-900/50 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors">Save Changes</button>
            </div>
          </form>

          {/* Right Pane: Live Preview */}
          <div className="p-6 bg-gray-900/50 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">AI Agent Live Preview</h3>
            <div className="flex-grow bg-gray-800 rounded-lg p-4 space-y-4 overflow-y-auto">
              {previewMessages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role !== 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><RobotIcon className="w-5 h-5 text-cyan-300"/></div>}
                  <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600 text-white' : msg.role === 'error' ? 'bg-red-500/80 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isPreviewLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><RobotIcon className="w-5 h-5 text-cyan-300"/></div>
                    <div className="px-4 py-2 rounded-xl bg-gray-700 text-gray-200">
                        <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendPreview} className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                placeholder="Test your agent..."
                disabled={isPreviewLoading}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
              <button type="submit" disabled={isPreviewLoading || !previewInput.trim()} className="p-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageModal;