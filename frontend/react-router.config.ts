import type { Config } from "@react-router/dev/config";

export default {
  // This app is deployed as a static SPA on Netlify, with a separate
  // Express API (see /backend) doing the data/auth/AI work. Runtime SSR
  // is disabled, but the public marketing routes are prerendered to
  // static HTML at build time so they still have fast first paint and
  // are fully crawlable by search engines.
  ssr: false,
  async prerender() {
    return ["/", "/login", "/register"];
  },
} satisfies Config;
