interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
    };
    metadata: any;
  };
}

export class PaystackService {
  private secretKey: string;
  private publicKey: string = "";

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || "";
    if (!this.secretKey) {
      throw new Error("Paystack secret key not configured");
    }
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || "";
  }

  async initializePayment(params: {
    email: string;
    amount: number; // Amount in kobo (smallest currency unit)
    reference?: string;
    metadata?: any;
    callback_url?: string;
  }): Promise<PaystackInitializeResponse> {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Paystack initialization failed: ${error.message}`);
    }

    return response.json();
  }

  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Paystack verification failed: ${error.message}`);
    }

    return response.json();
  }

  generateReference(prefix: string = "SAMAD"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  convertToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  convertFromKobo(amount: number): number {
    return amount / 100;
  }

  getPublicKey(): string {
    return this.publicKey;
  }
}

export function createPaystackService() {
  return new PaystackService();
}
