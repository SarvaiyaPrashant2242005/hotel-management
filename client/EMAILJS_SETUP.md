# EmailJS Setup Guide

## Installation

Run this command in the `client` folder:

```bash
npm install @emailjs/browser
```

## Configuration Steps

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account

### 2. Add Email Service
- Go to **Email Services** in the dashboard
- Click **Add New Service**
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the connection instructions
- Copy your **Service ID**

### 3. Create Email Template
- Go to **Email Templates** in the dashboard
- Click **Create New Template**
- Use these template variables in your email template:
  - `{{user_name}}` - Sender's name
  - `{{user_email}}` - Sender's email
  - `{{subject}}` - Email subject
  - `{{message}}` - Email message content

Example template:
```
New Contact Form Submission

From: {{user_name}}
Email: {{user_email}}
Subject: {{subject}}

Message:
{{message}}
```

- Save the template and copy your **Template ID**

### 4. Get Public Key
- Go to **Account** → **General**
- Copy your **Public Key**

### 5. Configure Environment Variables

Create or update the `.env` file in the `client` folder:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Important Notes:**
- In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client
- Never commit `.env` to version control (it's in `.gitignore`)
- Use `.env.example` as a template for other developers
- Restart your dev server after changing `.env` files

## Testing

1. Make sure your `.env` file is configured
2. Restart your development server: `npm run dev`
3. Navigate to the Contact page
4. Fill out the form and submit
5. Check your configured email inbox for the message

## Troubleshooting

- **Configuration Required error**: Make sure your `.env` file exists and has all three variables
- **Variables undefined**: Restart your dev server after creating/updating `.env`
- **Failed to Send error**: Check your EmailJS dashboard for quota limits (free tier: 200 emails/month)
- **CORS errors**: Ensure your domain is allowed in EmailJS settings

## Free Tier Limits
- 200 emails per month
- 2 email services
- 2 email templates

For more emails, upgrade to a paid plan.

## Production Deployment

For production, set these environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Other platforms: Check their documentation for environment variable configuration
