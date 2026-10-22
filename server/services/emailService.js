const nodemailer = require('nodemailer');

// Create email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send booking confirmation email to user
 */
async function sendBookingConfirmationEmail(booking) {
  try {
    const meetingDateTime = new Date(`${booking.meetingDate}T${booking.meetingTime}`);
    const formattedDate = meetingDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Meeting Confirmed! ✅</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
            Hi <strong>${booking.userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Your meeting has been confirmed! We're looking forward to speaking with you.
          </p>

          <div style="background: white; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">Meeting Details</h3>
            
            <table style="width: 100%; color: #475569; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Service:</td>
                <td>${booking.serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td>${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                <td>${booking.meetingTime} (${booking.timeZone})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                <td>${booking.duration} minutes</td>
              </tr>
              ${booking.meetingLink ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Meeting Link:</td>
                <td><a href="${booking.meetingLink}" style="color: #3b82f6; text-decoration: none;">${booking.meetingLink}</a></td>
              </tr>
              ` : ''}
            </table>
          </div>

          ${booking.meetingDetails ? `
          <div style="background: #f1f5f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #475569; font-size: 13px; margin: 0;"><strong>Additional Details:</strong></p>
            <p style="color: #64748b; font-size: 13px; margin: 8px 0 0 0; white-space: pre-wrap;">${booking.meetingDetails}</p>
          </div>
          ` : ''}

          <p style="color: #64748b; font-size: 13px; margin: 25px 0 0 0; line-height: 1.6;">
            Please make sure to join the meeting a few minutes early. If you have any questions, feel free to reach out to us.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2026 DiasporaNRI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.userEmail,
      subject: `Meeting Confirmed - ${booking.serviceType}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Confirmation sent to ${booking.userEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send confirmation:', error.message);
    return false;
  }
}

/**
 * Send booking cancellation email to user
 */
async function sendBookingCancellationEmail(booking) {
  try {
    const meetingDateTime = new Date(`${booking.meetingDate}T${booking.meetingTime}`);
    const formattedDate = meetingDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7c3aed; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Meeting Cancelled</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
            Hi <strong>${booking.userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Your meeting scheduled for <strong>${formattedDate}</strong> at <strong>${booking.meetingTime}</strong> has been cancelled.
          </p>

          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
            If you would like to reschedule or have any questions, please don't hesitate to contact us.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2026 DiasporaNRI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.userEmail,
      subject: 'Meeting Cancelled',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Cancellation sent to ${booking.userEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send cancellation:', error.message);
    return false;
  }
}

/**
 * Send booking rejection email to user
 */
async function sendBookingRejectionEmail(booking) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Booking Status Update</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">
            Hi <strong>${booking.userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Unfortunately, we're unable to accommodate your requested meeting time. Please try booking another time slot or feel free to contact us directly.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2026 DiasporaNRI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.userEmail,
      subject: 'Booking Status Update',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Rejection sent to ${booking.userEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send rejection:', error.message);
    return false;
  }
}

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendBookingRejectionEmail
};
