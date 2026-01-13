# SmartATS — Supabase Auth Email Templates (Copy/Paste)

Paste these into **Supabase Dashboard → Authentication → Email Templates**.

Each section below includes:
1) the **Subject** to paste into Supabase
2) the **HTML Body** to paste into Supabase

## 1) Confirm sign up

**Subject:** Confirm your email for SmartATS Resume

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;letter-spacing:0.2px;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">ATS-optimized resumes that get interviews</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 8px;">Confirm your email</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 14px;">
                  {{ if .Data.full_name }}Hi {{ .Data.full_name }},{{ else }}Hi,{{ end }}
                </div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 18px;">
                  Thanks for creating an account. Please confirm your email address to finish setup.
                </div>

                <div style="text-align:center;margin:22px 0 24px;">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#041014;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;">
                    Confirm email
                  </a>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0 0 8px;">
                  If the button doesn’t work, paste this link into your browser:
                </div>
                <div style="font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color:#fbbf24;text-decoration:none;">{{ .ConfirmationURL }}</a>
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t request this, you can safely ignore this email.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 2) Invite user

**Subject:** You’re invited to SmartATS Resume

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Invitation</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">You’ve been invited</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 18px;">
                  You’ve been invited to create an account on <strong style="color:#ffffff;">SmartATS Resume</strong>.
                </div>

                <div style="text-align:center;margin:22px 0 24px;">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#fbbf24;color:#1b1202;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;">
                    Accept invite
                  </a>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0 0 8px;">
                  If the button doesn’t work, paste this link into your browser:
                </div>
                <div style="font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color:#fbbf24;text-decoration:none;">{{ .ConfirmationURL }}</a>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 3) Magic link

**Subject:** Your SmartATS sign-in link

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Secure sign-in</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Your sign-in link</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 18px;">
                  Click the button below to sign in. This link expires for your security.
                </div>

                <div style="text-align:center;margin:22px 0 24px;">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#041014;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;">
                    Sign in
                  </a>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0 0 8px;">
                  If the button doesn’t work, paste this link into your browser:
                </div>
                <div style="font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color:#fbbf24;text-decoration:none;">{{ .ConfirmationURL }}</a>
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t request this email, you can ignore it.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 4) Reset password

**Subject:** Reset your SmartATS password

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Password reset</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Reset your password</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 18px;">
                  We received a request to reset the password for <strong style="color:#ffffff;">{{ .Email }}</strong>.
                  If this was you, use the button below.
                </div>

                <div style="text-align:center;margin:22px 0 24px;">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#fbbf24;color:#1b1202;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;">
                    Reset password
                  </a>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0 0 8px;">
                  If the button doesn’t work, paste this link into your browser:
                </div>
                <div style="font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color:#fbbf24;text-decoration:none;">{{ .ConfirmationURL }}</a>
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t request a password reset, ignore this email—your password won’t change.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 5) Change email address (confirmation)

**Subject:** Confirm your SmartATS email change

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Email change</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Confirm email change</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 18px;">
                  You requested to change your email from <strong style="color:#ffffff;">{{ .Email }}</strong>
                  to <strong style="color:#ffffff;">{{ .NewEmail }}</strong>.
                </div>

                <div style="text-align:center;margin:22px 0 24px;">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#14b8a6;color:#041014;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;">
                    Confirm email change
                  </a>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0 0 8px;">
                  If the button doesn’t work, paste this link into your browser:
                </div>
                <div style="font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="{{ .ConfirmationURL }}" style="color:#fbbf24;text-decoration:none;">{{ .ConfirmationURL }}</a>
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t request this change, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 6) Reauthentication

**Subject:** SmartATS verification code

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Verification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Verification code</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0 0 14px;">
                  Use the code below to continue:
                </div>

                <div style="text-align:center;margin:18px 0 24px;">
                  <div style="display:inline-block;background:#070a12;border:1px solid #1f2937;border-radius:14px;padding:14px 18px;font-size:22px;letter-spacing:6px;font-weight:900;color:#fbbf24;">
                    {{ .Token }}
                  </div>
                </div>

                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t request this code, you can ignore this email.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 7) Security notification — Password changed

**Subject:** Security alert: your SmartATS password was changed

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Password changed</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  This is a confirmation that the password for <strong style="color:#ffffff;">{{ .Email }}</strong> was just changed.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, reset your password immediately and contact support.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 8) Security notification — Email address changed

**Subject:** Security alert: your SmartATS email was changed

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Email changed</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  Your email address was changed from <strong style="color:#ffffff;">{{ .OldEmail }}</strong> to <strong style="color:#ffffff;">{{ .Email }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 9) Security notification — Phone number changed

**Subject:** Security alert: your SmartATS phone number was changed

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Phone number changed</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  The phone number for <strong style="color:#ffffff;">{{ .Email }}</strong> was changed from <strong style="color:#ffffff;">{{ .OldPhone }}</strong> to <strong style="color:#ffffff;">{{ .Phone }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, contact support immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 10) Security notification — Identity linked

**Subject:** Security alert: a new sign-in method was linked to your SmartATS account

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">New identity linked</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  A new identity (<strong style="color:#ffffff;">{{ .Provider }}</strong>) was linked to your account <strong style="color:#ffffff;">{{ .Email }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 11) Security notification — Identity unlinked

**Subject:** Security alert: a sign-in method was removed from your SmartATS account

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">Identity unlinked</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  An identity (<strong style="color:#ffffff;">{{ .Provider }}</strong>) was unlinked from your account <strong style="color:#ffffff;">{{ .Email }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 12) Security notification — MFA method added

**Subject:** Security alert: MFA enabled on your SmartATS account

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">MFA method added</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  A new MFA factor (<strong style="color:#ffffff;">{{ .FactorType }}</strong>) was added to your account <strong style="color:#ffffff;">{{ .Email }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 13) Security notification — MFA method removed

**Subject:** Security alert: MFA changed on your SmartATS account

**Body (HTML):**

```html
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05070b;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#0b0f19;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #1f2937;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://smartatsresume.com/horse-logo.png" width="40" height="40" alt="SmartATS" style="display:block;border:0;outline:none;" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:800;color:#ffffff;">SmartATS Resume</div>
                      <div style="font-size:12px;color:#9ca3af;">Security notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <div style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 10px;">MFA method removed</div>
                <div style="font-size:14px;line-height:1.6;color:#d1d5db;margin:0;">
                  An MFA factor (<strong style="color:#ffffff;">{{ .FactorType }}</strong>) was removed from your account <strong style="color:#ffffff;">{{ .Email }}</strong>.
                </div>

                <hr style="border:0;border-top:1px solid #1f2937;margin:22px 0;" />
                <div style="font-size:12px;line-height:1.6;color:#9ca3af;">
                  If you didn’t do this, secure your account immediately.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;background:#070a12;border-top:1px solid #1f2937;">
                <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                  © SmartATS Resume • <a href="https://smartatsresume.com" style="color:#6b7280;text-decoration:none;">smartatsresume.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```
