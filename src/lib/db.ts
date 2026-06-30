import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB(): D1Database {
  const ctx = getCloudflareContext();
  return ctx.env.bar_menu_db;
}
