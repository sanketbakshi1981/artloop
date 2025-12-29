const nodemailer = require('nodemailer');

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
            paymentStatus
        } = req.body;

        // Validate required fields
        if (!orderID || !customerName || !customerEmail || !eventTitle || !ticketQuantity || !totalAmount) {
            context.res = {
                status: 400,
                body: { error: 'Missing required fields' }
            };
            return;
        }

        // Configure email transporter
        // For Azure, you can use SendGrid, Azure Communication Services, or other SMTP providers
        // This example uses SendGrid
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY // Store this in Azure Function App Settings
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 ArtLoop - Payment Confirmation</h1>
        </div>
        <div class="content">
            <div class="success-icon">✓</div>
            <h2>Thank you for your purchase, ${customerName}!</h2>
            <p>Your payment has been successfully processed. Here are your order details:</p>
            
            <div class="ticket-details">
                <h3>Order Summary</h3>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span>${orderID}</span>
                </div>
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
                    <span class="detail-label">Number of Tickets:</span>
                    <span>${ticketQuantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span><strong>$${totalAmount.toFixed(2)}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span style="color: #48bb78;"><strong>${paymentStatus}</strong></span>
                </div>
            </div>

            <p><strong>Contact Information:</strong></p>
            <p>Email: ${customerEmail}<br>Phone: ${customerPhone}</p>

            <p>Please bring this confirmation email or show the order ID at the venue entrance.</p>
            
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

        // Email template for administrators
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 New Order Notification</h1>
        </div>
        <div class="content">
            <div class="alert">
                <strong>New ticket purchase received!</strong>
            </div>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span>${orderID}</span>
                </div>
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
                    <span>${customerPhone}</span>
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
                    <span class="detail-label">Tickets Purchased:</span>
                    <span>${ticketQuantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span><strong>$${totalAmount.toFixed(2)}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span style="color: #48bb78;"><strong>${paymentStatus}</strong></span>
                </div>
            </div>

            <p><strong>Action Required:</strong> Please review this order and ensure the customer receives their tickets.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Email recipients
        const adminEmails = ['sanket.bakshi@gmail.com', 'k.vikramk@gmail.com'];
        
        // Send email to customer
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@artloop.com',
            to: customerEmail,
            subject: `Order Confirmation - ${eventTitle}`,
            html: customerEmailHtml
        });

        context.log(`Customer email sent to: ${customerEmail}`);

        // Send email to admins
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@artloop.com',
            to: adminEmails.join(', '),
            subject: `New Order Alert - ${eventTitle} - ${customerName}`,
            html: adminEmailHtml
        });

        context.log(`Admin emails sent to: ${adminEmails.join(', ')}`);

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Emails sent successfully',
                orderID: orderID
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
