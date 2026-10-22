# Ledger Lens Daily

Create a premium, high-end financial and legal news portal tailored for a global audience, utilizing a sophisticated corporate identity inspired by Bloomberg and The Financial Times. Use a clean, elite color palette featuring deep slate blues, financial emerald greens (#0f5132), charcoal text, and crisp white backgrounds. The typography must look highly professional and editorial.

 

The application must include the following structural features:

1. HOME PAGE:

   - A prominent 'Breaking News / Hero Section' showcasing the single most relevant article with a large image and excerpt.

   - A structured grid layout displaying recent articles categorized beautifully into: "Markets", "Crypto", "Global Economy", and "Regulations & Law".

   - Each article card must feature a high-quality cover image, a dynamic category badge, title, short excerpt, and publishing date.

   - Integrate a visual 'Trending / Impact Score' indicator on the cards.

 

2. ARTICLE DETAIL PAGE:

   - A clean, distraction-free reading layout for the full article content.

   - Support for rendering full HTML/Markdown smoothly (including paragraph breaks, bold text, and blockquotes).

   - A sidebar showing 'Other Top Financial Stories' and a placeholder area for ad banners (optimized for Adsterra/Monetag scripts).

 

3. DATABASE & API STRUCTURE:

   - Create a local state/mock database table named `news` containing the exact fields required for incoming automated integrations:

     * `id` (unique identifier)

     * `title` (string)

     * `category` (strict match: "Markets", "Crypto", "Global Economy", or "Regulations & Law")

     * `excerpt` (text summary)

     * `content` (full HTML/Markdown body text)

     * `image_url` (public URL for the cover photo)

     * `created_at` (timestamp)

   - Pre-populate this table with 4 highly polished, realistic financial news examples written in flawless American English so I can immediately visualize the dynamic layout.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ledger-lens-daily.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb5868c5-3f14-4660-8019-2f53b2dcd67a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
