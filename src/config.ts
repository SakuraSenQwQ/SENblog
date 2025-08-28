import type {
  ExpressiveCodeConfig,
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "森语",
  subtitle: "SENblog",
  lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
  themeColor: {
    hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false, // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: "assets/images/124383634_p0.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
    credit: {
      enable: true, // Display the credit text of the banner image
      text: "阿米娅和罗德岛", // Credit text to be displayed
      url: "https://www.pixiv.net/artworks/124383634", // (Optional) URL link to the original artwork or artist's page
    },
  },
  toc: {
    enable: true, // Display the table of contents on the right side of the post
    depth: 3, // Maximum heading depth to show in the table, from 1 to 3
  },
  favicon: [
    {
      src: "https://sakurasen.cn/imgs/avat.jpg", // Path of the favicon, relative to the /public directory
      theme: "light", // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
      sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
    },
  ],
};

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: "友情链接",
      url: "https://sakurasen.cn/friends", // Internal links should not include the base path, as it is automatically added
      external: true, // Show an external link icon and will open in a new tab
    },
    {
      name: "开往",
      url: "https://www.travellings.cn/go.html", // Internal links should not include the base path, as it is automatically added
      external: true, // Show an external link icon and will open in a new tab
    },
  ],
};

export const profileConfig: ProfileConfig = {
  avatar: "https://sakurasen.cn/imgs/avat.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: "SEN",
  bio: "无限进步",
  links: [
    {
      name: "Twitter",
      icon: "fa6-brands:bilibili", // Visit https://icones.js.org/ for icon codes
      // You will need to install the corresponding icon set if it's not already included
      // `pnpm add @iconify-json/<icon-set-name>`
      url: "https://space.bilibili.com/511629145",
    },
    {
      name: "Steam",
      icon: "fa6-brands:steam",
      url: "https://steamcommunity.com/id/SakuraSenQwQ/",
    },
    {
      name: "QQ",
      icon: "fa6-brands:qq",
      url: "https://jq.qq.com/?_wv=1027&k=G2D7IA7x",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/SakuraSenQwQ",
    },
    {
      name: "Email",
      icon: "fa6-solid:envelope",
      url: "mailto:im@sakurasen.cn",
    },
  ],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "SEN-FREE-License",
  url: "/copyright/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
  // Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
  // Please select a dark theme, as this blog theme currently only supports dark background color
  theme: "github-dark",
};
