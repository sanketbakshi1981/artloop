// Test script to verify SendGrid configuration
const nodemailer = require('nodemailer');

// Replace these with your actual values
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'your-api-key-here';
const FROM_EMAIL = 'sanket.bakshi@gmail.com'; // Must be verified in SendGrid
const TEST_EMAIL = 'sanket.bakshi@gmail.com'; // Where you want to receive the test email

async function testEmail() {
    console.log('Testing SendGrid email configuration...\n');

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: SENDGRID_API_KEY
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
            <h2>Your SendGrid configuration is working!</h2>
            <p>This is a test email to verify that your SendGrid API key and email settings are correctly configured.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
                <li>From Email: ${FROM_EMAIL}</li>
                <li>API Key: ${SENDGRID_API_KEY.substring(0, 10)}...</li>
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
            subject: 'ArtLoop - SendGrid Test Email',
            html: testEmailHtml
        });

        console.log('✓ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your inbox at:', TEST_EMAIL);
        console.log('\nYour SendGrid configuration is working correctly! 🎉');

    } catch (error) {
        console.error('✗ Error sending email:');
        console.error(error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Verify your SendGrid API key is correct');
        console.error('2. Ensure FROM_EMAIL is verified in SendGrid');
        console.error('3. Check that your SendGrid account is active');
        console.error('4. Verify API key has Mail Send permissions');
    }
}

testEmail();
