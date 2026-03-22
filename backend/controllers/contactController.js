import { sendContactEmail } from '../utils/emailService.js';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const emailSent = await sendContactEmail({ name, email, subject, message });

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully.'
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
};
