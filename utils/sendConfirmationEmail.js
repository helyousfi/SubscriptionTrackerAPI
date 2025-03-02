import transporter, { accountEmail } from '../config/nodemailer.js'

const sendConfirmationEmail = async (userEmail, confirmationToken) => {
    try{
        const confirmationLink = `http://domain.com/confirm?token=${confirmationToken}`;
        const mailOptions = {
            from: accountEmail,
            to: userEmail,
            subject: 'Please confirm your email address',
            html: `
                <h2>Welcome to Our Service!</h2>
                <p>Click the link below to confirm your subscription:</p>
                <a href="${confirmationLink}">${confirmationLink}</a>
                <p>If you didn’t request this, you can ignore this email.</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${userEmail}`);
    }
    catch (error) {
        console.log('Error sending confirmation Email!', error);
    }
}

export default sendConfirmationEmail;