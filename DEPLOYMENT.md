# वार्ड नंबर 14 (श्रीमती पूजा मनीष दाधीच) — Deployment Guide

This full-stack application is built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas (Mongoose)**, and **Cloudinary**. It is designed to deploy seamlessly to **Vercel** on the free tier and can easily be migrated to **Hostinger (Node.js VPS / Cloud Hosting)** with zero vendor lock-in.

---

## 1. Quick Local Development

1. Open PowerShell / Command Prompt in `C:\manishpuja`:
   ```bash
   cd C:\manishpuja
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Default Admin Password: `ward14admin2026`

*Note: In local development, if `MONGODB_URI` or `CLOUDINARY_*` keys are not yet provided, the application gracefully uses an in-memory storage and base64 preview, ensuring immediate testing without crashes.*

---

## 2. MongoDB Atlas Setup (Free Tier Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free M0 cluster.
2. Under **Database Access**, create a user (e.g. `ward14user`) with read/write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so Vercel serverless functions can connect.
4. Click **Connect** > **Drivers** > **Node.js** and copy the URI:
   ```env
   MONGODB_URI=mongodb+srv://ward14user:<password>@cluster0.xxxxx.mongodb.net/ward14db?retryWrites=true&w=majority
   ```

---

## 3. Cloudinary Setup (Free Image Hosting)

1. Go to [Cloudinary](https://cloudinary.com) and create a free account.
2. In your Dashboard, copy the credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

Add them to your `.env.local` or Vercel Environment Variables:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 4. Environment Variables Checklist

Ensure these variables are set in Vercel or your production `.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://...` |
| `ADMIN_PASSWORD` | Password for `/admin` Dashboard | `ward14admin2026` |
| `ADMIN_SECRET` | Secret token for session signing | `poojadadhich_ward14_supersecret_key_2026` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name | `mycloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `xxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_APP_URL` | Production Domain | `https://ward14poojadadhich.vercel.app` |

---

## 5. Vercel Deployment (Free)

1. Push the code from `C:\manishpuja` to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Ward 14 Smt. Pooja Manish Dadhich website"
   git remote add origin https://github.com/your-username/ward14-website.git
   git push -u origin main
   ```

2. Visit [Vercel](https://vercel.com) and click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Expand **Environment Variables** and paste the variables from the checklist above.
5. Click **Deploy**. Vercel will build and deploy the Next.js application in under 2 minutes.

---

## 6. Future Migration to Hostinger (VPS / Node.js Hosting)

Because this application uses standard Next.js without any Vercel-proprietary dependencies:

1. On Hostinger VPS (Ubuntu / Debian):
   ```bash
   # Install Node.js 20 or 22
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. Clone repository on the VPS:
   ```bash
   git clone https://github.com/your-username/ward14-website.git
   cd ward14-website
   npm install
   npm run build
   ```

3. Start with PM2:
   ```bash
   pm2 start npm --name "ward14" -- start
   pm2 save
   pm2 startup
   ```

4. Configure Nginx reverse proxy to forward port 80/443 to `http://localhost:3000`.

---

## 7. Quality & Verification Checklist

- [x] Responsive layout verified across 320px, 375px, 414px, 768px, 1024px, 1440px.
- [x] Candidate identity preserved with high-resolution photo in `/public/images/ward14-hero.png`.
- [x] Unique Reference ID generated upon citizen issue submission (`WARD14-XXXXXX`).
- [x] Instant WhatsApp sharing button with pre-filled message.
- [x] Public issue tracking at `/track` without exposing private citizen information.
- [x] Secure administrative portal at `/admin` with status update, internal notes, and filtering.
- [x] Citizen voluntary feedback form with non-voting statutory disclaimer.
- [x] Complete SEO, OpenGraph tags, Devanagari Hindi font typography, and `<html lang="hi">`.
