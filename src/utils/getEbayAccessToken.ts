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

  // Enhanced environment variable logging
  console.log('Token request environment:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length,
    clientSecretLength: clientSecret?.length,
    nodeEnv: process.env.NODE_ENV
  });

  if (!clientId || !clientSecret) {
    throw new Error('Missing eBay OAuth credentials. Please ensure EBAY_PROD_APP_ID and EBAY_PROD_CERT_ID are set in your environment variables.');
  }

  // Create Basic Auth header
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    console.log('Requesting token from eBay OAuth endpoint...');
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
      console.error('eBay OAuth error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to get eBay access token: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: TokenResponse = await response.json();
    console.log('Successfully obtained new token, expires in:', data.expires_in, 'seconds');

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