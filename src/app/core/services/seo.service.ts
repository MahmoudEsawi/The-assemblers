import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateTitle(title: string): void {
    this.title.setTitle(`${title} | The Assemblers - Home Services in Jordan`);
  }

  updateMetaTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    const defaultConfig = {
      title: 'The Assemblers - Professional Home Services in Jordan',
      description: 'Connect with trusted professionals for all your home service needs in Jordan. Plumbing, electrical work, painting, carpentry, and more. Book services with verified assemblers.',
      keywords: 'home services, assemblers, Jordan, plumbing, electrical, painting, carpentry, handyman, repair, maintenance',
      image: '/assets/og-image.jpg',
      url: 'https://theassemblers.jo',
      type: 'website'
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Update title
    this.updateTitle(finalConfig.title);

    // Update meta tags
    this.meta.updateTag({ name: 'description', content: finalConfig.description });
    this.meta.updateTag({ name: 'keywords', content: finalConfig.keywords });
    this.meta.updateTag({ name: 'author', content: 'The Assemblers' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: finalConfig.title });
    this.meta.updateTag({ property: 'og:description', content: finalConfig.description });
    this.meta.updateTag({ property: 'og:image', content: finalConfig.image });
    this.meta.updateTag({ property: 'og:url', content: finalConfig.url });
    this.meta.updateTag({ property: 'og:type', content: finalConfig.type });
    this.meta.updateTag({ property: 'og:site_name', content: 'The Assemblers' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: finalConfig.title });
    this.meta.updateTag({ name: 'twitter:description', content: finalConfig.description });
    this.meta.updateTag({ name: 'twitter:image', content: finalConfig.image });

    // Additional SEO tags
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    this.meta.updateTag({ name: 'theme-color', content: '#6366f1' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-capable', content: 'yes' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
  }

  updateStructuredData(data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
