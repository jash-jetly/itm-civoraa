# Email Rate Limit Guide

## What happened?
You received an "email rate limit exceeded" error because Supabase has protective limits on how many emails can be sent to prevent spam.

## Why does this happen?
1. **Supabase Default Limits**: <mcreference link="https://supabase.com/docs/guides/auth/rate-limits" index="1">1</mcreference>
   - Default: 3-5 emails per hour per email address
   - This is a server-side limit that cannot be bypassed from the client

2. **Development Testing**: 
   - Repeatedly testing OTP functionality hits these limits quickly
   - Each test request counts toward your limit

## Solutions

### Immediate Fix (Wait it out)
- **Wait 5-10 minutes** before trying again
- The rate limit resets automatically
- Don't keep clicking "Send OTP" - it makes it worse

### For Development
1. **Use different email addresses** for testing
2. **Wait between tests** (at least 2 minutes)
3. **Use the browser's developer tools** to clear localStorage if needed

### For Production (Configure Supabase)
1. **Increase Rate Limits** in Supabase Dashboard:
   - Go to Authentication → Settings
   - Adjust "Rate Limiting" settings
   - Increase `rate_limit_email_sent` value

2. **Use Custom SMTP** (Recommended):
   - Configure Gmail, Zoho, or Resend
   - This gives you more control over sending limits
   - Go to Authentication → Settings → SMTP Settings

### Code Changes Made
- ✅ Better error messages for rate limits
- ✅ Reduced client-side rate limiting (3 attempts max, 2-minute cooldown)
- ✅ Specific handling for 429 errors

## Current App Limits
- **Max attempts**: 3 per 15 minutes
- **Cooldown**: 2 minutes between requests
- **Window**: 15 minutes reset period

## Tips
- Don't spam the "Send OTP" button
- Use different test emails during development
- Consider using a custom SMTP provider for production
- The error is protective - it prevents spam and abuse