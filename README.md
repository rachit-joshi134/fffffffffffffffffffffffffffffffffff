# NextLayer Studio + NextLayer AI + ISRO Racing

## Features
- Integrated agency, AI services, and ISRO Racing public website.
- 100 driver roster records with individual profile views, state/city fields, provisional state standings, and unique driver IDs. Rachit Joshi retains ISRO-UGT-2026-017 and Pithoragarh, Uttarakhand. The roster names and points require administrator verification before being represented as official competition records.
- Driver/category search, leaderboard, racing calendar, registration form, certificate/driver lookup, fee listing, and office-only payment policy.
- Admin dashboard with driver edits, publish toggles, fee management, applications, event/news/settings management.
- Optional Gemini/OpenAI server-side function example.
- Netlify Functions and Netlify Blobs persistence.

## Local build
Requires Node.js 20 or later. From the project root:

```bash
npm install
npm run build
```

The site is static in `public/`. To test Netlify Functions locally, install/use Netlify CLI separately and run `netlify dev`.

## Netlify setup
- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`
- Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `JWT_SECRET` in Netlify environment variables.
- Optional: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `APP_URL`.
- Redeploy after changing production environment variables.

Generate a bcrypt hash locally using the installed `bcryptjs` package, e.g. `node -e "require('bcryptjs').hash('YOUR_PASSWORD', 12).then(console.log)"`. Generate a JWT secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Never commit `.env` or share private secrets.

## Data persistence
Public seed roster is a starting data file. Netlify Functions use Netlify Blobs for persisted application state. On first admin save, the function initializes from the seed data. Check function logs and test persistence on the deployed site before relying on it operationally. Do not use unverified demo-style results as official competition records; verify profile data before publication.

## Admission payments
No online payment gateway is implemented. Fees are paid in person at the official admission office in Pune during admission. Confirm the office address and fee details with the organization. The listed fees are configurable starting values and must be approved before being represented as final official pricing. State ranks and points in the initial roster are provisional, not independently verified results.

## Important
The build script verifies required static entry points. It does not prove live database, authentication, email, or deployment functionality. Test the deployed Netlify functions and admin workflows before production use.
