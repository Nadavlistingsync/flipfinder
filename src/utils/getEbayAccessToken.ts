interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: string | null = null;
let expires = 0;

export async function getEbayAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < expires) return cachedToken;

  const id  = process.env.EBAY_PROD_APP_ID!;
  const sec = process.env.EBAY_PROD_CERT_ID!;
  const basic = Buffer.from(`${id}:${sec}`).toString('base64');

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  const data = await res.json();
  if (!data.access_token) throw new Error('eBay auth failed');

  cachedToken = data.access_token;
  expires     = Date.now() + data.expires_in * 1000 - 60_000; // renew 1 min early
  return cachedToken;
} 