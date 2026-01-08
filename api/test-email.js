// Test script to verify Mailgun configuration
const nodemailer = require('nodemailer');

// Replace these with your actual values
const MAILGUN_SMTP_HOST = process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org';
const MAILGUN_SMTP_USERNAME = process.env.MAILGUN_SMTP_USERNAME || 'postmaster@your-domain.mailgun.org';
const MAILGUN_SMTP_PASSWORD = process.env.MAILGUN_SMTP_PASSWORD || 'your-smtp-password';
const FROM_EMAIL = 'noreply@your-domain.com'; // Must be from your verified Mailgun domain
const TEST_EMAIL = 'sanket.bakshi@gmail.com'; // Where you want to receive the test email

async function testEmail() {
    console.log('Testing Mailgun email configuration...\n');

    try {
        const transporter = nodemailer.createTransport({
            host: MAILGUN_SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: MAILGUN_SMTP_USERNAME,
                pass: MAILGUN_SMTP_PASSWORD
            }
        });

        const testEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a5568; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .success { color: #48bb78; font-size: 24px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 ArtLoop Email Test</h1>
        </div>
        <div class="content">
            <div class="success">✓ Success!</div>
            <h2>Your Mailgun configuration is working!</h2>
            <p>This is a test email to verify that your Mailgun SMTP credentials and email settings are correctly configured.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
                <li>SMTP Host: ${MAILGUN_SMTP_HOST}</li>
                <li>SMTP Username: ${MAILGUN_SMTP_USERNAME}</li>
                <li>From Email: ${FROM_EMAIL}</li>
                <li>Test Date: ${new Date().toLocaleString()}</li>
            </ul>
            <p>You're all set to send order confirmation emails!</p>
        </div>
    </div>
</body>
</html>
        `;

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: FROM_EMAIL,
            to: TEST_EMAIL,
            subject: 'ArtLoop - Mailgun Test Email',
            html: testEmailHtml
        });

        console.log('✓ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your inbox at:', TEST_EMAIL);
        console.log('\nYour Mailgun configuration is working correctly! 🎉');

    } catch (error) {
        console.error('✗ Error sending email:');
        console.error(error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Verify your Mailgun SMTP credentials are correct');
        console.error('2. Ensure FROM_EMAIL uses your verified Mailgun domain');
        console.error('3. Check that your Mailgun account is active');
        console.error('4. Verify your domain is properly configured in Mailgun');
        console.error('5. Check that SMTP is enabled for your Mailgun domain');
    }
}

testEmail();
