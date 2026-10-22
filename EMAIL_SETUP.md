# Email Notification System Setup Guide

## Overview
The booking system now includes automated email notifications when admins confirm, cancel, or update meeting bookings.

## Setup Instructions

### 1. **Install Required Package**
```bash
cd server
npm install nodemailer
```

### 2. **Configure Environment Variables**

Add these to your `.env` file in the `server` directory:

```env
# Email Configuration (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. **Gmail Setup (Recommended)**

#### Option A: Using Gmail App Password (Recommended)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already done
3. Go back to Security settings
4. Find "App passwords" (appears after 2FA is enabled)
5. Select "Mail" and "Windows Computer" (or your platform)
6. Copy the generated 16-character password
7. Use this as your `EMAIL_PASSWORD`

#### Option B: Using Less Secure App Access
1. Go to https://myaccount.google.com/security
2. Enable "Less secure app access"
3. Use your Gmail password as `EMAIL_PASSWORD`

### 4. **Alternative Email Services**

You can use any service supported by Nodemailer:
- SendGrid
- Mailgun
- Office365
- Yahoo
- Custom SMTP

Example for SendGrid:
```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-sendgrid-api-key
```

---

## How It Works

### **Automatic Email Triggers**

1. **Booking Confirmation** (Status: Pending → Confirmed)
   - User receives email with:
     - Meeting details (date, time, service)
     - Meeting link (if provided by admin)
     - Additional meeting details
   - Button to join meeting directly

2. **Booking Cancellation** (Status → Cancelled)
   - User receives cancellation notification
   - Shows originally scheduled time
   - Encourages rescheduling

3. **Booking Rejection** (Other status changes)
   - User receives status update notification

### **Email Templates**

All emails include:
- ✅ Branding (DiasporaNRI colors and logo)
- 📅 Meeting details
- 🔗 Meeting link with direct join button
- 📝 Additional meeting information
- Professional formatting

---

## Admin Dashboard

### **When Confirming a Booking:**

1. Click "Edit" on a booking
2. Change status to "Confirmed"
3. Add meeting link (e.g., https://meet.google.com/xxx)
4. Add meeting details (optional instructions)
5. Click "Save"
6. ✉️ Email automatically sent to user

### **Visual Feedback**

- Success message shows: "Booking confirmed and email sent to user! 📧"
- Green checkmark appears on confirmed bookings
- "Join Meeting Now" button appears for users

---

## User Experience

### **For Users:**

1. **Booking Submitted** → Status shows "Pending"
   - Message: "Your booking is pending confirmation. You'll receive an email when it's confirmed with the meeting link."

2. **Booking Confirmed** → Status shows "Confirmed"
   - Green banner: "✓ Meeting Confirmed"
   - Prominent green button: "Join Meeting Now"
   - Meeting link clickable
   - Email received with all details

3. **Cancellation** → Email notification sent
   - Clear cancellation message
   - Option to rebook

---

## Troubleshooting

### **Emails Not Sending?**

1. **Check EMAIL credentials in .env**
   - Verify EMAIL_USER and EMAIL_PASSWORD are correct
   - Restart server after changing .env

2. **Gmail Specific**
   - Ensure 2FA is enabled
   - Use App Password (not account password)
   - Allow "Less secure apps" if using account password

3. **Check Server Logs**
   - Look for [Email] messages in console
   - Error messages will show email service issues

4. **Test Configuration**
   - Confirm booking with a test user
   - Check server logs for email sending attempt

### **Email Template Issues**

- If emails look formatted incorrectly, check the email client
- Gmail may strip some CSS styling
- Links should always work

---

## Security Notes

✅ **Best Practices:**
- Use App Passwords with Gmail (not account password)
- Don't share `.env` file
- Store credentials securely
- Emails are sent server-side (users never see credentials)

---

## Customization

### **Change Email Design**
Edit `/server/services/emailService.js` to modify:
- Colors and styling
- Email layout
- Text and messages
- Font and formatting

### **Add More Email Types**
You can add new email functions:
- Pre-meeting reminders (before 24 hours)
- Post-meeting feedback requests
- Payment confirmations
- etc.

---

## Testing

To test the email system:

1. **Create a test booking** as a user
2. **Go to Admin Dashboard**
3. **Find the booking** in the Bookings tab
4. **Click Edit** and set status to "Confirmed"
5. **Add a meeting link** (e.g., https://meet.google.com/test)
6. **Click Save**
7. **Check email** - Test email should arrive within seconds

---

## API Integration

### **Booking Confirmation Flow**

```
User Books Meeting
      ↓
Status: PENDING
      ↓
Admin Confirms & Adds Details
      ↓
Status: CONFIRMED
      ↓
EMAIL SERVICE
      ↓
Email Sent to User
      ↓
User Receives & Joins
```

---

## Current Implementation

✅ **Confirmed:**
- Email service ready
- Nodemailer configured
- Email templates created
- Admin dashboard shows email confirmation
- User sees meeting link when confirmed
- Automatic status-based email sending

🚀 **Ready to deploy!**

---

Need help? Check the error messages in server logs for specific issues.
