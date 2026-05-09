import { PortfolioPage, PortfolioPageProps } from "./starfall-portfolio-landing";
import { Code, Database, Globe } from "lucide-react";

const customPortfolioData: PortfolioPageProps = {
  logo: {
    initials: 'AT',
    name: 'Alex Thompson',
  },
  navLinks: [
    { label: 'Bio', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Expertise', href: '#skills' },
  ],
  resume: {
    label: 'Download CV',
    onClick: () => alert('Downloading CV...'),
  },
  hero: {
    titleLine1: 'Full-Stack Engineer &',
    titleLine2Gradient: 'UX Architect',
    subtitle: 'I build robust and scalable web applications with a strong focus on user-centric design and performance.',
  },
  ctaButtons: {
    primary: {
      label: 'Explore My Work',
      onClick: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); },
    },
    secondary: {
      label: 'Contact Me',
      onClick: () => { window.location.href = 'mailto:alex.thompson@example.com'; },
    },
  },
  projects: [
    { 
      title: 'E-commerce Platform', 
      description: 'A scalable online store built with Next.js, TypeScript, and Stripe.',
      tags: ['Next.js', 'Stripe', 'Vercel'],
      imageContent: <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop" alt="E-commerce" className="w-full h-full object-cover" />
    },
    { 
      title: 'SaaS Dashboard', 
      description: 'A real-time analytics dashboard for a B2B software-as-a-service product.',
      tags: ['React', 'Chart.js', 'Firebase'],
      imageContent: <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop" alt="Data Dashboard" className="w-full h-full object-cover" />
    },
    { 
      title: 'AI Content Generator', 
      description: 'Leveraging OpenAI to generate marketing copy for businesses.',
      tags: ['SvelteKit', 'OpenAI', 'Tailwind CSS'],
      imageContent: <Globe className="w-12 h-12 text-blue-400" />
    },
  ],
  stats: [
    { value: '7+', label: 'Years of Experience' },
    { value: '30+', label: 'Client Projects' },
    { value: '99%', label: 'Client Satisfaction' },
  ],
  showAnimatedBackground: true, 
};

export const DemoStarfall = () => {
  return <PortfolioPage {...customPortfolioData} />;
};
