import Ebay from 'ebay-api';

// Validate environment variables
const validateConfig = () => {
  const requiredVars = {
    EBAY_PROD_APP_ID: process.env.EBAY_PROD_APP_ID,
    EBAY_PROD_CERT_ID: process.env.EBAY_PROD_CERT_ID,
    EBAY_PROD_DEV_ID: process.env.EBAY_PROD_DEV_ID,
    EBAY_PROD_RU_NAME: process.env.EBAY_PROD_RU_NAME,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required eBay API credentials: ${missingVars.join(', ')}`);
  }
};

// Validate configuration on startup
validateConfig();

export const ebayConfig = {
  appId: process.env.EBAY_PROD_APP_ID || '',
  certId: process.env.EBAY_PROD_CERT_ID || '',
  devId: process.env.EBAY_PROD_DEV_ID || '',
  sandbox: false, // Always use production in this app
  siteId: 0, // eBay US site ID
  ruName: process.env.EBAY_PROD_RU_NAME || '',
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
};

// Initialize eBay client with error handling
let ebay: Ebay;
try {
  ebay = new Ebay({
    appId: ebayConfig.appId,
    certId: ebayConfig.certId,
    devId: ebayConfig.devId,
    sandbox: ebayConfig.sandbox,
    siteId: ebayConfig.siteId,
    ruName: ebayConfig.ruName,
    debug: ebayConfig.debug,
  });
} catch (error) {
  console.error('Failed to initialize eBay client:', error);
  throw error;
}

export { ebay }; 