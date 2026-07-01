import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface SocialLink {
  key: string;
  href: string;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  instagram: string;
  facebook: string;
  x: string;
  tiktok: string;
  linkedin: string;
  whatsapp: string;
  youtube: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  is_offer: boolean;
  image_url: string;
  available: boolean;
  featured: boolean;
  sort_order: number;
}

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const ctx = getCloudflareContext();
  const db = ctx.env.bar_menu_db;
  const result = await db.prepare("SELECT * FROM restaurant_info LIMIT 1").first();
  return result as RestaurantInfo | null;
}

export async function getMenu() {
  const ctx = getCloudflareContext();
  const db = ctx.env.bar_menu_db;

  const categories = await db
    .prepare("SELECT * FROM categories WHERE active = 1 ORDER BY sort_order")
    .all<Category>();

  const products = await db
    .prepare("SELECT * FROM products WHERE available = 1 ORDER BY sort_order")
    .all<Product>();

  return {
    categories: categories.results,
    products: products.results,
  };
}

export function extractSocialLinks(info: RestaurantInfo): { socialLinks: SocialLink[]; email: string } {
  return {
    socialLinks: [
      { key: 'whatsapp', href: info.whatsapp },
      { key: 'instagram', href: info.instagram },
      { key: 'facebook', href: info.facebook },
      { key: 'x', href: info.x },
      { key: 'tiktok', href: info.tiktok },
      { key: 'youtube', href: info.youtube },
      { key: 'linkedin', href: info.linkedin },
    ].filter((s) => s.href),
    email: info.email,
  };
}
