let cached: string | null = null;
let expires = 0;

export async function getEbayAccessToken(): Promise<string> {
  if (cached && Date.now() < expires) return cached;

  const id  = process.env.EBAY_PROD_APP_ID!;
  const sec = process.env.EBAY_PROD_CERT_ID!;
  if (!id || !sec) throw new Error('eBay prod env vars missing');

  const basic = Buffer.from(`${id}:${sec}`).toString('base64');
  const res   = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error('[eBay] Token fetch failed:', JSON.stringify(data));
    throw new Error('eBay auth failed');
  }

  cached  = data.access_token;
  expires = Date.now() + data.expires_in * 1000 - 60_000; // refresh 1 min early
  return cached;
} 