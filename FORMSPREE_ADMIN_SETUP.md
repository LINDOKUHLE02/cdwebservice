# Formspree Production Setup (Crafted Digital)

This site is already wired to submit quote requests to Formspree.

## 1) Anti-spam (Formspree Dashboard)

In Formspree form settings:
- Enable spam filtering.
- Enable CAPTCHA if available on your plan.
- Keep the website honeypot field from the site code as an extra layer.

## 2) Auto-reply Email to Client

In Formspree:
- Open your form settings.
- Enable Autoresponder.
- Target the submitter email field (email).
- Suggested subject: "We received your quote request"
- Suggested body:
  - Thank you for contacting Crafted Digital.
  - Your request reference is: {{requestId}}
  - Our admin team will respond after qualification.

## 3) Multiple Admin Notifications

In Formspree notifications:
- Add all admin recipient emails.
- Enable immediate notifications for each submission.

## 4) CRM / Google Sheets Integration

Two options:
- Native integration in Formspree (if available on your plan).
- Use Zapier/Make webhook flow.

### Webhook flow with this website

The form supports an optional CRM webhook in [index.html](index.html):
- data-crm-webhook=""

Set it to your Zapier/Make catch-hook URL, for example:
- data-crm-webhook="https://hooks.zapier.com/hooks/catch/xxxx/yyyy"

When Formspree succeeds, the site forwards a JSON payload to this webhook:
- requestId
- submittedAt
- company
- name
- email
- phone
- message
- estimateRange
- estimateSummary

## 5) Reference ID in Success Message

Already implemented in site code.
Users see a success message with a generated ID in this format:
- CD-YYYYMMDD-XXXXXX

The same requestId is submitted to Formspree and optional CRM webhook.

## Verification Checklist

- Submit a test quote request.
- Confirm Formspree receives requestId and estimate fields.
- Confirm autoresponder arrives in submitter inbox.
- Confirm all admin recipients get notified.
- Confirm CRM/Sheet receives webhook payload if configured.
