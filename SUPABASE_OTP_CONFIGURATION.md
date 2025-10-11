# Supabase OTP Configuration Guide

## Problem
Your app is currently sending magic links instead of OTP codes for email verification.

## Solution
To configure Supabase to send OTP codes instead of magic links, follow these steps:

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `doocugsjlgcqbxudinmu`

### 2. Configure Authentication Settings
1. Navigate to **Authentication** → **Settings** in the left sidebar
2. Scroll down to **Email** section

### 3. Disable Email Confirmations (Key Step)
1. Find the **"Enable email confirmations"** toggle
2. **DISABLE** this setting (turn it OFF)
3. This is crucial - when enabled, Supabase sends magic links; when disabled, it sends OTP codes

### 4. Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Select **"Magic Link"** template
3. You can customize the OTP email template here if needed

### 5. Alternative Method: Use Custom SMTP with OTP Template
If the above doesn't work, you can:
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your custom SMTP (Gmail/Zoho/Resend)
3. In **Email Templates**, select **"Confirm signup"** 
4. Modify the template to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`

### 6. Test the Configuration
1. Save all changes
2. Test your app's email verification flow
3. You should now receive a 6-digit OTP code instead of a magic link

## Code Changes Made
The code has been updated to:
- Remove `emailRedirectTo` parameter to prevent magic link generation
- Add explicit `otp_type: 'email'` in the data payload
- Include helpful comments about the configuration requirements

## Troubleshooting
If you still receive magic links:
1. Double-check that "Enable email confirmations" is DISABLED
2. Clear your browser cache and test again
3. Wait a few minutes for Supabase settings to propagate
4. Check your SMTP configuration if using custom email provider

## Important Notes
- This configuration affects ALL email authentication in your project
- Make sure your email templates are configured correctly
- Test thoroughly before deploying to production