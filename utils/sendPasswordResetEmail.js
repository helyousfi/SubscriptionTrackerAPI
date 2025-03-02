import transporter, { accountEmail } from '../config/nodemailer.js'
import { PORT } from '../config/env.js';

export const sendPasswordResetEmail = async (userEmail, confirmationToken) => {
    try{
        const resetLink = `http://localhost:${PORT}/api/v1/auth/reset-password?token=${confirmationToken}`;
        const mailOptions = {
            from: accountEmail,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset. Click the button below to reset your password:</p>
                <p style="text-align: center;">
                    <a href="${resetLink}"> Reset my password </a>
                </p>
                <p>This link is valid for 1 hour.</p>
            `,
        };
        
        console.log(resetLink);
    
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log('Error sending confirmation Email!', error);
    }
}