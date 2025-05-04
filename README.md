# FlipFinder

FlipFinder helps users find undervalued resale deals from major marketplaces and calculates ROI on each listing. The platform aggregates listings from multiple sources including eBay, Craigslist, Facebook Marketplace, Mercari, OfferUp, and Reddit.

## Features

- 🔍 Search across multiple marketplaces simultaneously
- 💰 Calculate ROI on potential deals
- 📊 Filter by platform, price range, and minimum ROI
- 🔄 Real-time updates (coming soon)
- 🔔 Deal alerts (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for various marketplaces (see Configuration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flipfinder.git
cd flipfinder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_reddit_user_agent
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### API Keys

The following API keys are required for full functionality:

- **eBay**: Get your API keys from the [eBay Developer Program](https://developer.ebay.com/)
- **Reddit**: Create an application at [Reddit Apps](https://www.reddit.com/prefs/apps)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_reddit_user_agent
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **API Integration**: Various marketplace APIs and web scraping

## Roadmap

- [ ] Implement real-time updates
- [ ] Add deal alerts and notifications
- [ ] Integrate user authentication
- [ ] Add price history tracking
- [ ] Implement advanced filtering options
- [ ] Add mobile app support
- [ ] Integrate payment processing (Stripe)
- [ ] Add social sharing features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
