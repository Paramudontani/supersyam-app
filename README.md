# Supersyam

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Agoda affiliate booking

Hotel booking links are generated on the server through Agoda Lite Search. Copy `.env.example` to `.env.local` and set the values issued for the Supersyam Agoda account:

```env
AGODA_API_URL=http://affiliateapi7643.agoda.com/affiliateservice/lt_v1
AGODA_AUTHORIZATION=SITE_ID:AGODA_API_KEY
AGODA_CITY_IDS={"Bangkok":9395}
```

`AGODA_AUTHORIZATION` must never use a `NEXT_PUBLIC_` prefix or be committed to the repository. Obtain the approved city IDs from Agoda; the API requires a city ID, not a city name. Add each approved city with a numeric ID, for example `{"Bangkok":9395,"Phuket":12345}`. When configured, the server sends the Lite Search request and redirects visitors to the `landingURL` returned by Agoda.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
