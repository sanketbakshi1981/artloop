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

export interface RegistrationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketQuantity: number;
  hostEmail: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderData): Promise<EmailResult> {
  try {
    // Get the API endpoint from environment or use default
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || '/api/send-email';
    
    console.log('🔄 Sending order confirmation email to:', apiEndpoint);
    console.log('📧 Order data:', orderData);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response', status: response.status };
      }
      console.error('❌ Email service error:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        details: errorData
      };
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export interface EmailResult {
  success: boolean;
  error?: string;
  details?: any;
}

export async function sendRegistrationEmail(registrationData: RegistrationData): Promise<EmailResult> {
  try {
    // Get the API endpoint from environment or use default
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || '/api/send-email';
    
    console.log('🔄 Sending registration email to:', apiEndpoint);
    console.log('📧 Registration data:', registrationData);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...registrationData,
        isRegistration: true,
        totalAmount: 0,
        paymentStatus: 'FREE',
      }),
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response', status: response.status };
      }
      console.error('❌ Registration email service error:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        details: errorData
      };
    }

    const result = await response.json();
    console.log('✅ Registration email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send registration email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}
