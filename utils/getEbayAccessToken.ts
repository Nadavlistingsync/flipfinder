interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export async function getEbayAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const appId = process.env.EBAY_PROD_APP_ID;
  const certId = process.env.EBAY_PROD_CERT_ID;

  // Debug logging for environment variables
  console.log('EBAY_PROD_APP_ID:', appId ? 'set' : 'NOT SET');
  console.log('EBAY_PROD_CERT_ID:', certId ? 'set' : 'NOT SET');

  if (!appId || !certId) {
    throw new Error(`Missing eBay API credentials. EBAY_PROD_APP_ID: ${appId ? 'set' : 'NOT SET'}, EBAY_PROD_CERT_ID: ${certId ? 'set' : 'NOT SET'}`);
  }

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get eBay token: ${error}`);
    }

    const data = await response.json();
    
    // Cache the token with expiration (subtract 5 minutes for safety margin)
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };

    return tokenCache.token;
  } catch (error) {
    console.error('Error getting eBay access token:', error);
    throw error;
  }
} 