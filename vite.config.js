import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';

const pages = [
  'about',
  'contactus',
  'enroll_now',
  'student_login',
  'staff_login',
  'news',
  'news_detail',
  'admin_login',
  'admin_dashboard',
  'admin_news',
  'admin_news_form',
];

function cleanUrlPlugin() {
  return {
    name: 'wins-clean-url-dev-and-build',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next();
        const url = req.url.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
        if (pages.includes(url)) {
          req.url = req.url.replace(url, `${url}.html`);
        }
        next();
      });
    },
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
      for (const file of ['.htaccess', 'robots.txt', 'sitemap.xml', 'site.webmanifest']) {
        const source = resolve(__dirname, file);
        if (existsSync(source)) copyFileSync(source, resolve(dist, file));
      }
      // Copy PHP API and data folders to dist for Apache/PHP hosting
      for (const dir of ['api', 'data']) {
        const srcDir = resolve(__dirname, dir);
        const destDir = resolve(dist, dir);
        if (existsSync(srcDir)) {
          cpSync(srcDir, destDir, { recursive: true });
        }
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [cleanUrlPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contactus.html'),
        enroll: resolve(__dirname, 'enroll_now.html'),
        student: resolve(__dirname, 'student_login.html'),
        staff: resolve(__dirname, 'staff_login.html'),
        news: resolve(__dirname, 'news.html'),
        newsDetail: resolve(__dirname, 'news_detail.html'),
        adminLogin: resolve(__dirname, 'admin_login.html'),
        adminDashboard: resolve(__dirname, 'admin_dashboard.html'),
        adminNews: resolve(__dirname, 'admin_news.html'),
        adminNewsForm: resolve(__dirname, 'admin_news_form.html')
      }
    }
  }
});
