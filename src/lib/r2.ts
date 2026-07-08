import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getBucket() {
  const ctx = getCloudflareContext();
  return ctx.env.bar_menu_images;
}

export function publicUrl(key: string) {
  return `/api/images/${key}`;
}
