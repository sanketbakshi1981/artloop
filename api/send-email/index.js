const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Generate a random 5-character alphanumeric registration code
function generateRegistrationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

module.exports = async function (context, req) {
    context.log('Send email function processed a request.');

    try {
        const {
            orderID,
            customerName,
            customerEmail,
            customerPhone,
            eventTitle,
            eventDate,
            eventTime,
            eventVenue,
            ticketQuantity,
            totalAmount,
            paymentStatus,
            isRegistration,
            hostEmail
        } = req.body;

        // Validate required fields
        if (!customerName || !customerEmail || !eventTitle || !ticketQuantity) {
            context.res = {
                status: 400,
                body: { error: 'Missing required fields' }
            };
            return;
        }

        // For registrations, orderID is not required
        const isFreeEvent = isRegistration || totalAmount === 0 || paymentStatus === 'FREE';
        const finalOrderID = orderID || `REG-${Date.now()}`;

        // Generate registration code for free events
        const registrationCode = isFreeEvent ? generateRegistrationCode() : null;
        
        // Generate QR code for free events
        let qrCodeDataURL = null;
        if (isFreeEvent && registrationCode) {
            try {
                // Create verification URL with registration details
                const baseUrl = process.env.WEBSITE_URL || 'https://artloop.azurewebsites.net';
                const verificationUrl = `${baseUrl}/verify?code=${registrationCode}&email=${encodeURIComponent(customerEmail)}&quantity=${ticketQuantity}&name=${encodeURIComponent(customerName)}&event=${encodeURIComponent(eventTitle)}&date=${encodeURIComponent(eventDate)}&time=${encodeURIComponent(eventTime)}&venue=${encodeURIComponent(eventVenue)}`;
                
                // Generate QR code as Data URL
                qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                
                context.log('QR code generated successfully');
            } catch (qrError) {
                context.log.error('Error generating QR code:', qrError);
                // Continue without QR code if generation fails
            }
        }

        // Configure email transporter
        // For Azure, you can use Mailgun, Azure Communication Services, or other SMTP providers
        // This example uses Mailgun
        const transporter = nodemailer.createTransport({
            host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAILGUN_SMTP_USERNAME,
                pass: process.env.MAILGUN_SMTP_PASSWORD // Store this in Azure Function App Settings
            }
        });

        // Email template for customer
        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a5568; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .ticket-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
        .success-icon { font-size: 48px; text-align: center; color: #48bb78; margin: 20px 0; }
        .qr-code-section { background-color: #edf2f7; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .registration-code { font-size: 32px; font-weight: bold; color: #2d3748; letter-spacing: 4px; margin: 15px 0; font-family: monospace; }
        .qr-code-img { max-width: 300px; margin: 15px auto; display: block; }
        .instructions { background-color: #c6f6d5; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #48bb78; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 ArtLoop - ${isFreeEvent ? 'Registration Confirmation' : 'Payment Confirmation'}</h1>
        </div>
        <div class="content">
            <div class="success-icon">✓</div>
            <h2>Thank you for your ${isFreeEvent ? 'registration' : 'purchase'}, ${customerName}!</h2>
            <p>${isFreeEvent ? 'Your registration has been successfully confirmed.' : 'Your payment has been successfully processed.'} Here are your ${isFreeEvent ? 'registration' : 'order'} details:</p>
            
            ${isFreeEvent && registrationCode && qrCodeDataURL ? `
            <div class="qr-code-section">
                <h3>Your Registration QR Code</h3>
                <div class="registration-code">${registrationCode}</div>
                <p style="margin: 10px 0; color: #4a5568;">Registration Code</p>
                <img src="${qrCodeDataURL}" alt="Registration QR Code" class="qr-code-img" />
                <div class="instructions">
                    <strong>📱 Important:</strong> Present this QR code at the venue entrance for quick check-in.<br>
                    Alternatively, you can provide the registration code: <strong>${registrationCode}</strong>
                </div>
            </div>
            ` : ''}
            
            <div class="ticket-details">
                <h3>${isFreeEvent ? 'Registration Summary' : 'Order Summary'}</h3>
                <div class="detail-row">
                    <span class="detail-label">${isFreeEvent ? 'Registration ID:' : 'Order ID:'}</span>
                    <span>${finalOrderID}</span>
                </div>
                ${isFreeEvent && registrationCode ? `
                <div class="detail-row">
                    <span class="detail-label">Registration Code:</span>
                    <span style="font-weight: bold; font-size: 18px; font-family: monospace;">${registrationCode}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Event:</span>
                    <span>${eventTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span>${eventDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span>${eventTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Venue:</span>
                    <span>${eventVenue}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Number of ${isFreeEvent ? 'Attendees:' : 'Tickets:'}</span>
                    <span>${ticketQuantity}</span>
                </div>
                ${!isFreeEvent ? `
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span><strong>$${totalAmount.toFixed(2)}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span style="color: #48bb78;"><strong>${paymentStatus}</strong></span>
                </div>
                ` : ''}
            </div>

            <p><strong>Contact Information:</strong></p>
            <p>Email: ${customerEmail}<br>Phone: ${customerPhone || 'Not provided'}</p>

            <p>${isFreeEvent && qrCodeDataURL ? 'Please bring this confirmation email and show the QR code or registration code at the venue entrance.' : 'Please bring this confirmation email or show the ' + (isFreeEvent ? 'registration' : 'order') + ' ID at the venue entrance.'}</p>
            
            <p>If you have any questions, please contact us at sanket.bakshi@gmail.com</p>
        </div>
        <div class="footer">
            <p>© 2025 ArtLoop. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Email template for administrators/host
        const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d3748; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .order-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: bold; }
        .alert { background-color: #edf2f7; padding: 10px; border-left: 4px solid #4299e1; margin: 15px 0; }
        .registration-code { font-size: 24px; font-weight: bold; color: #2d3748; letter-spacing: 3px; font-family: monospace; background: #fed7d7; padding: 10px; border-radius: 5px; text-align: center; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 New ${isFreeEvent ? 'Registration' : 'Order'} Notification</h1>
        </div>
        <div class="content">
            <div class="alert">
                <strong>New ${isFreeEvent ? 'event registration' : 'ticket purchase'} received!</strong>
            </div>
            
            ${isFreeEvent && registrationCode ? `
            <div class="registration-code">
                Registration Code: ${registrationCode}
            </div>
            ` : ''}
            
            <div class="order-details">
                <h3>${isFreeEvent ? 'Registration Details' : 'Order Details'}</h3>
                <div class="detail-row">
                    <span class="detail-label">${isFreeEvent ? 'Registration ID:' : 'Order ID:'}</span>
                    <span>${finalOrderID}</span>
                </div>
                ${isFreeEvent && registrationCode ? `
                <div class="detail-row">
                    <span class="detail-label">Registration Code:</span>
                    <span style="font-weight: bold; font-size: 18px; font-family: monospace;">${registrationCode}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Customer Name:</span>
                    <span>${customerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Email:</span>
                    <span>${customerEmail}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Phone:</span>
                    <span>${customerPhone || 'Not provided'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event:</span>
                    <span>${eventTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event Date:</span>
                    <span>${eventDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event Time:</span>
                    <span>${eventTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Venue:</span>
                    <span>${eventVenue}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${isFreeEvent ? 'Attendees:' : 'Tickets Purchased:'}</span>
                    <span>${ticketQuantity}</span>
                </div>
                ${!isFreeEvent ? `
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span><strong>$${totalAmount.toFixed(2)}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span style="color: #48bb78;"><strong>${paymentStatus}</strong></span>
                </div>
                ` : ''}
            </div>

            <p><strong>Action Required:</strong> Please review this ${isFreeEvent ? 'registration' : 'order'} and ensure the customer receives ${isFreeEvent ? 'confirmation' : 'their tickets'}.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Email recipients - send to host email if it's a free event, otherwise to admins
        const adminEmails = ['sanket.bakshi@gmail.com', 'k.vikramk@gmail.com'];
        const recipients = isFreeEvent && hostEmail ? [hostEmail, ...adminEmails] : adminEmails;
        
        // Send email to customer
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@artloop.com',
            to: customerEmail,
            subject: `${isFreeEvent ? 'Registration' : 'Order'} Confirmation - ${eventTitle}`,
            html: customerEmailHtml
        });

        context.log(`Customer email sent to: ${customerEmail}`);

        // Send email to admins/host
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@artloop.com',
            to: recipients.join(', '),
            subject: `New ${isFreeEvent ? 'Registration' : 'Order'} Alert - ${eventTitle} - ${customerName}`,
            html: adminEmailHtml
        });

        context.log(`${isFreeEvent ? 'Host and admin' : 'Admin'} emails sent to: ${recipients.join(', ')}`);

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Emails sent successfully',
                orderID: finalOrderID,
                registrationCode: registrationCode,
                qrCodeDataURL: qrCodeDataURL
            }
        };

    } catch (error) {
        context.log.error('Error sending email:', error);
        context.res = {
            status: 500,
            body: {
                success: false,
                error: 'Failed to send emails',
                details: error.message
            }
        };
    }
};
