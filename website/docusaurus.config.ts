import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ArtLoop',
  tagline: 'Where Art meets Performance',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Custom fields for client-side access
  customFields: {
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  },

  // Set the production url of your site here
  // TODO: Change to 'https://artloop.us' once DNS is configured
  // url: 'https://gray-water-0a5b86410.1.azurestaticapps.net',
  url: 'https://artloop.us',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // Azure Static Web Apps deployment config
  organizationName: 'sanketbakshi1981', // Usually your GitHub org/user name.
  projectName: 'artloop', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'ArtLoop',
      logo: {
        alt: 'ArtLoop Logo',
        src: 'img/ArtLoop-Logo-Small-Transparent.png',
      },
      items: [
        {to: '/', label: 'Upcoming Events', position: 'left'},
        {to: '/artists', label: 'Discover Artists', position: 'left'},
        {to: '/about', label: 'About Us', position: 'left'},
        {to: '/contact', label: 'Contact Us', position: 'left'},
        {to: '/register/host', label: 'Become a Host', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'For Hosts',
          items: [
            {
              label: 'Register as Host',
              to: '/register/host',
            },
            {
              label: 'Browse Events',
              to: '/',
            },
            {
              label: 'Discover Artists',
              to: '/artists',
            },
          ],
        },
        {
          title: 'For Performers',
          items: [
            {
              label: 'Register as Performer',
              to: '/register/performer',
            },
            {
              label: 'Discover Artists',
              to: '/artists',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Email Us',
              href: 'mailto:sanket.bakshi@gmail.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ArtLoop. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
