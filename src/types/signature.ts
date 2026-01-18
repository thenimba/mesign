export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  website?: string;
}

export interface SignatureColors {
  primary: string;
  secondary: string;
  text: string;
}

export type FontFamily = 'Inter' | 'Rubik' | 'Heebo' | 'Arimo' | 'Noto Sans Hebrew';
export type Direction = 'ltr' | 'rtl';
export type TemplateLayout = 'classic' | 'stacked';

export interface SignatureData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  socials: SocialLinks;
  colors: SignatureColors;
  fontFamily: FontFamily;
  direction: Direction;
  template: TemplateLayout;
}

export const defaultSignatureData: SignatureData = {
  fullName: 'John Doe',
  jobTitle: 'Senior Product Designer',
  companyName: 'Acme Inc.',
  email: 'john@acme.com',
  phone: '+1 (555) 123-4567',
  address: 'San Francisco, CA',
  logoUrl: '',
  socials: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: '',
    instagram: '',
    facebook: '',
    github: '',
    website: 'https://acme.com',
  },
  colors: {
    primary: '#22d3ee',
    secondary: '#94a3b8',
    text: '#334155',
  },
  fontFamily: 'Inter',
  direction: 'ltr',
  template: 'classic',
};
