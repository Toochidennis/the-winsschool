# XAMPP / Apache deployment

This project has two parts:

- Vite frontend source files for development
- Plain PHP API files for the file-based News/Admin system

The production/deployable folder is `dist/` after running:

```bash
npm install
npm run build
```

The build copies these into `dist/`:

```txt
dist/
  *.html
  assets/
  winsschool/
  api/
  data/
  .htaccess
  robots.txt
  sitemap.xml
```

## Local XAMPP test

```bash
npm run build
sudo rm -rf /opt/lampp/htdocs/wins
sudo mkdir -p /opt/lampp/htdocs/wins
sudo rsync -a dist/ /opt/lampp/htdocs/wins/
sudo chmod -R 775 /opt/lampp/htdocs/wins/data
sudo chmod 664 /opt/lampp/htdocs/wins/data/news.json
```

Open:

```txt
http://localhost/wins
http://localhost/wins/api/news.php
http://localhost/wins/admin_login.html
```

Default admin login is configured in `api/config.php`.
Change it before production.
