// Email service to send order confirmation emails via Azure Functions
export interface OrderData {
  orderID: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketQuantity: number;
  totalAmount: number;
  paymentStatus: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderData): Promise<boolean> {
  try {
    // Get the API endpoint from environment or use default
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || '/api/send-email';
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email service error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}
