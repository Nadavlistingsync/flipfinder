import Ebay from 'ebay-api';

export const ebayConfig = {
  appId: process.env.EBAY_APP_ID || '',
  certId: process.env.EBAY_CERT_ID || '',
  devId: process.env.EBAY_DEV_ID || '',
  sandbox: process.env.NODE_ENV !== 'production',
  siteId: 'EBAY-US' as const,
  ruName: process.env.EBAY_RU_NAME || '',
};

export const ebay = new Ebay({
  appId: ebayConfig.appId,
  certId: ebayConfig.certId,
  devId: ebayConfig.devId,
  sandbox: ebayConfig.sandbox,
  siteId: ebayConfig.siteId,
  ruName: ebayConfig.ruName
}); 