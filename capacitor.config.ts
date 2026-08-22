import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rentreceiptpro.app",
  appName: "Rent Receipt Pro",
  // Local fallback bundle. The app itself is server-rendered (TanStack Start),
  // so the native shell loads the hosted deployment defined in `server.url`.
  webDir: "mobile/www",
  server: {
    url: "https://rentreceipt.co.ke",
    cleartext: false,
    androidScheme: "https",
    allowNavigation: [
      "rentreceiptpro.lovable.app",
      "*.lovable.app",
      "lmktuiltbixjxdairwkm.supabase.co",
      "*.supabase.co",
      "checkout.paystack.com",
      "*.paystack.com",
      "accounts.google.com",
      "oauth.lovable.app",
    ],
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#0B1220",
      showSpinner: false,
    },
  },
};

export default config;
