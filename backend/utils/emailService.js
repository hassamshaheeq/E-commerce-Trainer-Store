import { createTransport } from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    // For development, you can use Gmail or any SMTP service
    // For production, use a service like SendGrid, AWS SES, etc.
    return createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASSWORD // Your app password
        }
    });
};

// Send order confirmation email with QR code
export const sendOrderConfirmationEmail = async (order, qrCodeDataUrl) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.user.email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .order-details {
                            background-color: #f9fafb;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .product-item {
                            border-bottom: 1px solid #e5e7eb;
                            padding: 15px 0;
                        }
                        .product-item:last-child {
                            border-bottom: none;
                        }
                        .qr-section {
                            text-align: center;
                            margin: 30px 0;
                            padding: 20px;
                            background-color: #f9fafb;
                            border-radius: 8px;
                        }
                        .qr-section img {
                            max-width: 200px;
                            margin: 20px 0;
                        }
                        .authenticity-badge {
                            display: inline-block;
                            background-color: #10b981;
                            color: white;
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-weight: bold;
                            margin: 10px 0;
                        }
                        .footer {
                            background-color: #1f2937;
                            color: #9ca3af;
                            text-align: center;
                            padding: 20px;
                            font-size: 14px;
                        }
                        .total {
                            font-size: 20px;
                            font-weight: bold;
                            color: #6366f1;
                            margin-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✓ Order Confirmed!</h1>
                            <p>Thank you for your purchase</p>
                        </div>
                        
                        <div class="content">
                            <p>Hi ${order.user.name},</p>
                            <p>Your order has been confirmed and will be shipped soon.</p>
                            
                            <div class="order-details">
                                <h2>Order #${order.orderNumber}</h2>
                                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><strong>Shipping Address:</strong><br/>
                                ${order.shippingAddress.fullName}<br/>
                                ${order.shippingAddress.address}<br/>
                                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br/>
                                ${order.shippingAddress.country}</p>
                                
                                <h3 style="margin-top: 20px;">Items Ordered:</h3>
                                ${order.items.map(item => `
                                    <div class="product-item">
                                        <strong>${item.title}</strong><br/>
                                        Size: ${item.size} | Quantity: ${item.quantity}<br/>
                                        Price: £${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                `).join('')}
                                
                                <div class="total">
                                    Total: £${order.totalAmount.toFixed(2)}
                                </div>
                            </div>
                            
                            <div class="qr-section">
                                <div class="authenticity-badge">✓ AUTHENTIC PRODUCT</div>
                                <h3>Product Authenticity Verification</h3>
                                <p>Scan this QR code to verify the authenticity of your products:</p>
                                <img src="${qrCodeDataUrl}" alt="QR Code" />
                                <p style="color: #6b7280; font-size: 14px;">
                                    This QR code contains a unique verification token that proves your products are genuine.
                                    Scan it with any QR code reader to view detailed product information.
                                </p>
                            </div>
                            
                            <p style="margin-top: 30px;">
                                If you have any questions about your order, please don't hesitate to contact us.
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Primekicks. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Send Contact Form Email
export const sendContactEmail = async (contactData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'hassamshaheeq8@gmail.com',
            subject: `New Contact Form Submission: ${contactData.subject || 'No Subject'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">New Contact Message</h2>
                    <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
                    <p><strong>Subject:</strong> ${contactData.subject || 'N/A'}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${contactData.message}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #666;">This message was sent from the Primekicks contact form.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact email sent successfully to hassamshaheeq8@gmail.com');
        return true;
    } catch (error) {
        console.error('Error sending contact email:', error);
        return false;
    }
};
