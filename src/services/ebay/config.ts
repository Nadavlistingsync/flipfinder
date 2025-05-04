import { Ebay } from 'ebay-api';

export const ebayConfig = {
  appId: process.env.EBAY_APP_ID || '',
  certId: process.env.EBAY_CERT_ID || '',
  devId: process.env.EBAY_DEV_ID || '',
  sandbox: process.env.NODE_ENV !== 'production',
  siteId: Ebay.SITE_ID.EBAY_US,
  ruName: process.env.EBAY_RU_NAME || '',
};

export const ebay = new Ebay({
  clientID: ebayConfig.appId,
  clientSecret: ebayConfig.certId,
  env: ebayConfig.sandbox ? 'SANDBOX' : 'PRODUCTION',
  headers: {
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
  },
}); 