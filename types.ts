export enum BusinessType {
  ECOMMERCE = 'E-commerce',
  TRAVEL = 'Travel Agency',
  ISP = 'Internet Service Provider',
  RESTAURANT = 'Restaurant',
  REAL_ESTATE = 'Real Estate',
  OTHER = 'Other',
}

export enum BrandVoice {
  FRIENDLY = 'Friendly',
  FORMAL = 'Formal',
  SALES_ORIENTED = 'Sales-Oriented',
  TAGLISH = 'Taglish (Tagalog-English)',
  HUMOROUS = 'Humorous',
}

export enum Language {
  ENGLISH = 'en',
  TAGALOG = 'tl',
  CEBUANO = 'ceb',
}

export interface Page {
  pageId: string;
  pageName: string;
  accessToken: string;
  businessType: BusinessType;
  brandVoice: BrandVoice;
  active: boolean;
  services: string[];
  language: Language;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  pictureUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  content: string;
}


// Add type declarations for the Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}