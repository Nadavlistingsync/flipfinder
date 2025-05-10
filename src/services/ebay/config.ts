import Ebay from 'ebay-api';

export const ebayConfig = {
  appId: process.env.EBAY_PROD_APP_ID || '',
  certId: process.env.EBAY_PROD_CERT_ID || '',
  devId: process.env.EBAY_PROD_DEV_ID || '',
  sandbox: false, // Always use production in this app
  siteId: '0' as const,
  ruName: process.env.EBAY_PROD_RU_NAME || '',
};

export const ebay = new Ebay({
  appId: ebayConfig.appId,
  certId: ebayConfig.certId,
  devId: ebayConfig.devId,
  sandbox: ebayConfig.sandbox,
  siteId: ebayConfig.siteId,
  ruName: ebayConfig.ruName
}); 