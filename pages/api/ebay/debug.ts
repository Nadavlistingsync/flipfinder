import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const appId  = process.env.EBAY_PROD_APP_ID || null;
  const certId = process.env.EBAY_PROD_CERT_ID || null;

  let ebayResponse: any = null;
  try {
    const basic = Buffer.from(`${appId}:${certId}`).toString('base64');
    const r     = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    });
    ebayResponse = await r.json();
  } catch (err: any) {
    ebayResponse = { fetchError: err.message };
  }

  res.status(200).json({
    envVars: {
      EBAY_PROD_APP_ID: !!appId,
      EBAY_PROD_CERT_ID: !!certId,
    },
    ebayResponse,
  });
} 