// ./controllers/emailController.js
const nodemailer = require('nodemailer');

// You would replace the following configuration with your actual email server details and credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your_email@example.com',
        pass: 'yourEmailPassword'
    }
});

exports.sendEmail = async (req, res) => {
    const { userEmail, userMessage } = req.body; // Extract user email and message from request body

    const mailOptions = {
        from: 'your_email@example.com',
        to: 'business@yourdomain.com', // Your business email where you want to receive messages
        subject: 'Message from Website Contact Form',
        text: `From: ${userEmail}\nMessage: ${userMessage}` // Email content
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/contact?message=success'); // Redirect back to the contact page or anywhere you prefer
    } catch (error) {
        console.error('Failed to send email:', error);
        res.redirect('/contact?message=fail'); // Redirect with an error indication
    }
};