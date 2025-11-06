import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ✅ Ensures correct asset paths in production (fixes 404 + blank page)
  base: '/',

  // ✅ Local dev server
  server: {
    host: "::",
    port: 3000,
  },

  // ✅ Plugins (React + dev-only component tagger)
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  // ✅ Path alias for cleaner imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Production build configuration
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: mode === "production" ? "hidden" : true,

    // ✅ Cleans old dist before each build
    outDir: "dist",
    emptyOutDir: true,

    // ✅ Rollup fine-tuning for optimal caching & splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
          ],
          "query-vendor": ["@tanstack/react-query"],
          "editor-vendor": [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-image",
          ],
          "utils-vendor": ["axios", "date-fns", "lucide-react"],

          // Admin-related bundles
          admin: [
            "./src/pages/admin/AdminDashboard.tsx",
            "./src/pages/admin/AdminArticles.tsx",
            "./src/pages/admin/AdminCategories.tsx",
            "./src/pages/admin/AdminSettings.tsx",
            "./src/pages/admin/AdminBreakingNews.tsx",
            "./src/pages/admin/AdminImages.tsx",
            "./src/pages/admin/AdminAuthors.tsx",
            "./src/pages/admin/AdminStaticPages.tsx",
          ],
        },

        // ✅ File naming for caching & versioning
        chunkFileNames: (chunkInfo) => {
          const name =
            chunkInfo.facadeModuleId
              ?.split("/")
              .pop()
              ?.replace(/\.(tsx|ts)$/, "") || "chunk";
          return `assets/${name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || "")) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // ✅ Other optimizations
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  // ✅ Build-time environment metadata
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },

  // ✅ Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "axios",
      "lucide-react",
    ],
    exclude: ["@tiptap/react", "@tiptap/starter-kit"],
  },
}));
