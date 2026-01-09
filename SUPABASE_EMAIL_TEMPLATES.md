# Supabase Auth Email Templates (SmartATS)

Paste these into **Supabase Dashboard → Authentication → Email Templates**.

> Notes
> - Uses Supabase template variables like `{{ .ConfirmationURL }}`.
> - Optional OTP is included via `{{ .Token }}`.

---

## 1) Confirm sign up
**Subject:** Confirm your SmartATS account

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">Confirm your email</div><p style="margin:0 0 16px;line-height:1.6;color:#d1d5db;">Thanks for signing up{{ if .Email }} as <strong>{{ .Email }}</strong>{{ end }}. Click the button below to confirm your email address.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#06211d;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800;">Confirm email</a><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">If your email client blocks buttons, open this link:</p><p style="margin:6px 0 0;font-size:12px;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;">{{ .ConfirmationURL }}</a></p><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or enter this one-time code (if prompted): <span style="font-family:ui-monospace,Menlo,Monaco,Consolas,monospace;font-weight:800;color:#ffffff;">{{ .Token }}</span></p><div style="margin-top:18px;padding-top:18px;border-top:1px solid #1f2937;font-size:12px;color:#9ca3af;">If you didn’t create a SmartATS account, you can safely ignore this email.</div></div></div>
```

---

## 2) Magic link
**Subject:** Your SmartATS sign-in link

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">Sign in to SmartATS</div><p style="margin:0 0 16px;line-height:1.6;color:#d1d5db;">Use the button below to sign in. This link is single-use and will expire shortly.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#06211d;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800;">Sign in</a><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or open this link:</p><p style="margin:6px 0 0;font-size:12px;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;">{{ .ConfirmationURL }}</a></p><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or enter this code (if prompted): <span style="font-family:ui-monospace,Menlo,Monaco,Consolas,monospace;font-weight:800;color:#ffffff;">{{ .Token }}</span></p><div style="margin-top:18px;padding-top:18px;border-top:1px solid #1f2937;font-size:12px;color:#9ca3af;">If you didn’t request this email, you can ignore it.</div></div></div>
```

---

## 3) Reset password
**Subject:** Reset your SmartATS password

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">Reset your password</div><p style="margin:0 0 16px;line-height:1.6;color:#d1d5db;">We received a request to reset your password. If you made this request, click the button below.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#f59e0b;color:#2b1600;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800;">Reset password</a><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or open this link:</p><p style="margin:6px 0 0;font-size:12px;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;">{{ .ConfirmationURL }}</a></p><p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">If you did not request a password reset, you can ignore this email—your password will not change.</p></div></div>
```

---

## 4) Change email address
**Subject:** Confirm your new SmartATS email

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">Confirm email change</div><p style="margin:0 0 16px;line-height:1.6;color:#d1d5db;">You requested to change the email on your SmartATS account{{ if .NewEmail }} to <strong>{{ .NewEmail }}</strong>{{ end }}. Confirm the change below.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#06211d;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800;">Confirm change</a><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or open this link:</p><p style="margin:6px 0 0;font-size:12px;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;">{{ .ConfirmationURL }}</a></p><div style="margin-top:18px;padding-top:18px;border-top:1px solid #1f2937;font-size:12px;color:#9ca3af;">If you didn’t request this change, please secure your account immediately.</div></div></div>
```

---

## 5) Invite user
**Subject:** You’re invited to SmartATS

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">You’ve been invited</div><p style="margin:0 0 16px;line-height:1.6;color:#d1d5db;">You’ve been invited to join SmartATS. Click below to accept and create your account.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#06211d;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800;">Accept invite</a><p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">Or open this link:</p><p style="margin:6px 0 0;font-size:12px;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;">{{ .ConfirmationURL }}</a></p><div style="margin-top:18px;padding-top:18px;border-top:1px solid #1f2937;font-size:12px;color:#9ca3af;">If you weren’t expecting an invite, you can ignore this email.</div></div></div>
```

---

## 6) Reauthentication
**Subject:** SmartATS security code

```html
<div style="background:#0b1220;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;"><div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;"><div style="font-weight:800;font-size:18px;margin-bottom:12px;color:#ffffff;">SmartATS Resume</div><div style="font-size:18px;font-weight:700;margin:0 0 8px;color:#ffffff;">Confirm it’s you</div><p style="margin:0 0 12px;line-height:1.6;color:#d1d5db;">Use this one-time security code to continue:</p><div style="display:inline-block;background:#0b1220;border:1px solid #1f2937;border-radius:10px;padding:12px 14px;font-family:ui-monospace,Menlo,Monaco,Consolas,monospace;font-weight:900;letter-spacing:2px;color:#ffffff;">{{ .Token }}</div><div style="margin-top:18px;padding-top:18px;border-top:1px solid #1f2937;font-size:12px;color:#9ca3af;">If you didn’t request this, someone may be trying to access your account.</div></div></div>
```

---

# Security notification templates (optional)
Enable these in **Authentication → Email Templates → Security notifications**.

## A) Password changed
**Subject:** Your SmartATS password was changed

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>Password changed</h2><p>This is a confirmation that the password for your account <strong>{{ .Email }}</strong> was just changed.</p><p>If you did not make this change, reset your password immediately.</p></div>
```

## B) Email address changed
**Subject:** Your SmartATS email address was changed

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>Email address changed</h2><p>Your account email was changed from <strong>{{ .OldEmail }}</strong> to <strong>{{ .Email }}</strong>.</p><p>If you did not make this change, secure your account immediately.</p></div>
```

## C) Identity linked
**Subject:** A new sign-in method was linked to your SmartATS account

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>New identity linked</h2><p>A new identity provider (<strong>{{ .Provider }}</strong>) was linked to your account <strong>{{ .Email }}</strong>.</p><p>If this wasn’t you, contact support.</p></div>
```

## D) Identity unlinked
**Subject:** A sign-in method was removed from your SmartATS account

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>Identity unlinked</h2><p>An identity provider (<strong>{{ .Provider }}</strong>) was unlinked from your account <strong>{{ .Email }}</strong>.</p><p>If this wasn’t you, contact support.</p></div>
```

## E) MFA method added
**Subject:** A new MFA method was added to your SmartATS account

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>MFA method added</h2><p>A new multi-factor method (<strong>{{ .FactorType }}</strong>) was added for <strong>{{ .Email }}</strong>.</p><p>If this wasn’t you, secure your account immediately.</p></div>
```

## F) MFA method removed
**Subject:** An MFA method was removed from your SmartATS account

```html
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;"><h2>MFA method removed</h2><p>A multi-factor method (<strong>{{ .FactorType }}</strong>) was removed for <strong>{{ .Email }}</strong>.</p><p>If this wasn’t you, secure your account immediately.</p></div>
```

