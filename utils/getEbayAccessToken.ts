interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

export async function getEbayAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.EBAY_PROD_APP_ID;
  const clientSecret = process.env.EBAY_PROD_CERT_ID;

  if (!clientId || !clientSecret) {
    throw new Error('Missing eBay OAuth credentials');
  }

  // Create Basic Auth header
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get eBay access token: ${response.statusText} - ${errorText}`);
    }

    const data: TokenResponse = await response.json();

    // Cache the token with expiration (subtract 5 minutes for safety margin)
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000
    };

    return data.access_token;
  } catch (error) {
    console.error('Error fetching eBay access token:', error);
    throw error;
  }
} 