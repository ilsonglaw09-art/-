export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
}

export interface SuccessfulCase {
  id: string;
  title: string;
  category: "부동산형사" | "부동산민사" | "일반형사" | "기타";
  result: string;
  description: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface SocialLinks {
  naverBlog: string;
  kakaoTalk: string;
  youtube: string;
  phone: string;
  tistory?: string;
}

export interface SiteStyle {
  themeMode: "pure-black" | "dark-slate";
  accentColor: string; // Hex color code
  accentText: string;  // Tailwind text color class or custom color
  fontFamily: "serif" | "sans" | "mono";
}

export interface SiteConfig {
  siteName: string;
  logoText: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  consultationPhone: string;
  address: string;
  businessHours: string;
  seo: SEOConfig;
  social: SocialLinks;
  style: SiteStyle;
  members: TeamMember[];
  cases: SuccessfulCase[];
  posts: BlogPost[];
}
