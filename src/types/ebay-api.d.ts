declare module 'ebay-api' {
  interface EbayConfig {
    appId: string;
    certId: string;
    devId: string;
    sandbox: boolean;
    siteId: number;
    debug: boolean;
    headers: Record<string, string>;
  }

  interface EbayApi {
    getAuthToken: (config: EbayConfig) => Promise<string>;
    getHeaders: (config: EbayConfig) => Record<string, string>;
    getRequest: (config: EbayConfig, method: string, data: any) => Promise<any>;
    postRequest: (config: EbayConfig, method: string, data: any) => Promise<any>;
  }

  class Ebay implements EbayApi {
    constructor(config: EbayConfig);
    getAuthToken(config: EbayConfig): Promise<string>;
    getHeaders(config: EbayConfig): Record<string, string>;
    getRequest(config: EbayConfig, method: string, data: any): Promise<any>;
    postRequest(config: EbayConfig, method: string, data: any): Promise<any>;
  }

  export default Ebay;
} 