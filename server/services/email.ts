import { Ticket, MerchOrder } from "../../shared/schema";

interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private config: EmailConfig;

  constructor() {
    this.config = {
      service: "gmail", // or "outlook", "yahoo", etc.
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASSWORD || "", // App password for Gmail
      },
    };
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.config.auth.user || !this.config.auth.pass) {
        console.log("Email service not configured, simulating email send to:", to);
        console.log("Subject:", subject);
        console.log("Content:", html);
        return true;
      }

      // In a real implementation, use nodemailer here
      // For now, we'll just log the email content
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML Content: ${html}`);
      
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  async sendTicketEmail(ticket: Ticket, eventTitle: string, eventDate: Date, eventVenue: string): Promise<boolean> {
    const subject = `Your Ticket for ${eventTitle} - ${ticket.ticketCode}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F59E0B; margin: 0;">Samad Music</h1>
          <p style="color: #ccc; margin: 5px 0;">Official E-Ticket</p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #F59E0B; margin-top: 0;">Event Details</h2>
          <p><strong>Event:</strong> ${eventTitle}</p>
          <p><strong>Date:</strong> ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}</p>
          <p><strong>Venue:</strong> ${eventVenue}</p>
          <p><strong>Ticket Tier:</strong> ${ticket.tierName}</p>
          <p><strong>Quantity:</strong> ${ticket.quantity}</p>
        </div>
        
        <div style="background-color: #F59E0B; color: #000; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="margin-top: 0;">Ticket Code</h3>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${ticket.ticketCode}</div>
          <p style="margin-bottom: 0; font-size: 12px;">Present this code at the event entrance</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #1a1a1a; border-radius: 10px;">
          <h3 style="color: #F59E0B; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${ticket.customerName}</p>
          <p><strong>Email:</strong> ${ticket.customerEmail}</p>
          <p><strong>Phone:</strong> ${ticket.customerPhone}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>Thank you for supporting Samad Music!</p>
          <p>For any inquiries, contact us at booking@samadmusic.com</p>
        </div>
      </div>
    `;

    return this.sendEmail(ticket.customerEmail, subject, html);
  }

  async sendOrderConfirmationEmail(order: MerchOrder, productName: string): Promise<boolean> {
    const subject = `Order Confirmation - ${productName} - ${order.trackingNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F59E0B; margin: 0;">Samad Music</h1>
          <p style="color: #ccc; margin: 5px 0;">Order Confirmation</p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #F59E0B; margin-top: 0;">Order Details</h2>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Total Amount:</strong> ₦${order.totalAmount.toLocaleString()}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        </div>
        
        <div style="background-color: #F59E0B; color: #000; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="margin-top: 0;">Tracking Number</h3>
          <div style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">${order.trackingNumber}</div>
          <p style="margin-bottom: 0; font-size: 12px;">Use this to track your order</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #1a1a1a; border-radius: 10px;">
          <h3 style="color: #F59E0B; margin-top: 0;">Delivery Information</h3>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Address:</strong><br>
            ${order.deliveryAddress.street}<br>
            ${order.deliveryAddress.city}, ${order.deliveryAddress.state}<br>
            ${order.deliveryAddress.postalCode}<br>
            ${order.deliveryAddress.country}
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>Your order will be processed within 2-3 business days.</p>
          <p>For any inquiries, contact us at support@samadmusic.com</p>
        </div>
      </div>
    `;

    return this.sendEmail(order.customerEmail, subject, html);
  }
}

export const emailService = new EmailService();
