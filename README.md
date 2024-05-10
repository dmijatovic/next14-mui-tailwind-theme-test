# MUI & Tailwind RSD upgrade to app folder approach

This is test for upgrading RSD to new next's app folder approach. We use Material UI and Tailwind integrated theme via settings.json.

**First, run the RSD from it's repo using `make start` in order to have backend running.**

## Getting Started

First time run `npm install`.

```bash
npm run dev
# or
npm run dev:tubo
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Material UI & Tailwind setup

The setup starts with advised solution for next.js integration on the [MUI documentation website](https://mui.com/material-ui/integrations/nextjs/). See

The MUI theme provider need to be in the root layout. This is server side component. MUI createTheme function MUST run on the client. You cannot call functions defined in the client only file ('use client') on the server side. It results in 'not a function error' from webpack. All functions that are client ONLY need to be called from the components marked with 'use client'.

**To solve this I created RsdMuiThemeProvider component**.

```bash
# install MUI dependencies
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
# install next specific mui dependencies
npm i @mui/material-nextjs @emotion/cache
# install tailwind typography
npm i -D @tailwindcss/typography
```

## RootLayout

Root layout is server side component. You cannot call functions defined in the client only file ('use client') on the server side. It results in 'not a function error' from webpack."provider" component.

I am testing the follwin approach in root layout. These are shared functionality for all app.

- Loading settings.json and RsdSettingsProvider centraly
- Loading AuthProvider centrally
- Loading SnackbarProvider centrally
- Loading AppHeader centrally
- Loading AppFooter centrally
- Loading nprogress bar centrally
- Loading Announcements centally
- Loading CookieConsentMatomo centrally

### HTML head imports

It is possible to import css file using <link> markup

### No next div in the root

**When using layout and app folder setup there is no root div with id `__next`**. The styles can be applied directy to body/main.

### RsdSettingsProvider

Can be imported in RootLayout but it need to have 'use client' indication.

### AuthProvider

**Cookie can be accessed directly because layout is server side component. We need to refactor this part.**

- AuthProvider is runned client only.
- If we perform majority of api calls in the server components we might NOT need token on the frontend. Ewan wants to remove this part anyway and use nginx function.
- Where to place token refresh method? Should it be in the middleware? How to signal to frontend if token expires.

### Snackbar provider

Can be imported in RootLayout but it need to have 'use client' indication.

### AppHeader

- update useAuth to useSession hook
- FIX: changing the pages is not reflected in the menu (selected status is not updated)!
- FIX: saveLocationCookie need to be moved to AppHeader
- min height should be increased to 6rem to accomodate avatar.
- Imports svg file directly and required additional webpack module. We can [use this link to manually create react components](https://react-svgr.com/playground/?typescript=true).

```bash
npm i -D @svgr/webpack
```

- There is exprimental support for turbopack to use @svgr/webpack. [See this page](https://nextjs.org/docs/app/api-reference/next-config-js/turbo#webpack-loaders).

- useRouter hook need to be migrated in GlobalSearchAutocomplete.tsx. I also changed useAuth hook.

```Javascript
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

The children to update: AddMenu.tsx

- Initially we try to use header client side in order to have hooks refreshing the data?

### AppFooter

Refactor component not to use useRsdSettings hook. The data from settings.json is passed as props in the layout.

### saveLocationCookie

- need to be moved to AppHeader ('use client') and use useEffect on pathname in order to save cookie on each route change.
- we use useEffect and usePathname hook

### nprogress bar implementation

App router does not have same events as the page router. The current approach DOES NOT WORK.
The implementation in app router is more complex at this point. Alternative is to use [library](https://github.com/TheSGJ/nextjs-toploader#readme)

### Announcements

The Announcement component can be placed in the root layout without problems.

## Tailwind and "turbo" compiler

When using "turbo" compiler the @import need to be before styles. That resulted in creating separate tailwind.css and custom.css file that are imported into global.css

## API endpoints

These should be still in the pages directory. No changes required asfik. Refresh endpoint requires cookie see [Auth module](#auth-module)

## ENV

- update env.local file with new HELMHOLTZID keyword.

## 404 page

The default page uses 100vh height. This does not work well with my root layout that uses fixed header and footer.
I created not-found.tsx at the root as custom 404 page.

## Next.config changes

- rewrites are NOT async.
- rename next.rewrites.mjs and use export default
- rewrites do not work without propper .env.local file!

## Auth module

I refactored auth module because client side methods need to have 'use client' flag. The server side method can in turn also have 'use server' flag.

- Move AuthProvider and auth hooks (useAuth, useSession) to separate file (AuthProvider.tsx) used client only ('use client')
- Move getUserFromToken to jwtUtils (NOTE! when marking file with 'use server' all methods need to be async)
- getSessionSeverSide has two approaches:
  - auth/getSessionSeverSide uses cookies module of Next and 'use server'
  - auth/api/getSessionSeverSide uses "old" page approach to support api in pages/fe/api

```bash
npm i jsonwebtoken
npm i -D @types/jsonwebtoken
# install cookie it is required by fe/api
npm i cookie
npm i -D @types/cookie
```

### Logout

The logout page should remove token and redirect to homepage. As I refactored getRsdTokenNode logout also need to move to app.
Deleting a cookie using cookies module from next can be only done from ServerAction or RouteHandler. I was not able to get ServerAction to work. RouteHandler is closer to api approach and I was able to get it working. See logout route.

## Matomo

- The matomo settings information should be retreived on server. In old version the matomo settings were split between `_app` and `_document` files. Now the settings can be integrated.
- Create new async method getMatomoSettings in 'use server' file where env variables MATOMO_ID, MATOMO_URL and the cookies mtm_consent and mtm_consent_removed can be extracted.
- getMatomoSettings can be then used in the root layout on server side.
- Create MatomoScript component to inject matomo script

## Security headers (nonce)

- **adding CSP headers using middleware.ts creates problems for the pages folder. See software page. Further research is needed**
- CSP headers and nonce creation is advised in the middleware.ts file. See [documentation](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- crypto module of node cannot be called in the same way as done in contentSecutoryPolicy.ts therefore I created separate method getCspHeader to reuse CSP policy but wit nonce created in middleware.ts
- setContentSecurityPolicyHeader and nonceContentSecurity cannot be used. High likely these can be removed.

### Default security headers

These are added in next.config.mjs. This approach still works and should be applied.

## SEO headers

**Adding headers to pages differs for client and server components!**.
[See basic documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata).

For server components metadata export object can be used. The information about [metadata object can be found here](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields).

```javascript
import type {Metadata} from 'next'

export const metadata:Metadata = {
  title: `Projects | ${app.title}`,
  description: 'Show all projects in the RSD',
  // adds og and twitter headers!
  openGraph: {
    title: `Projects | ${app.title}`,
    description: 'Show all projects in the RSD',
    siteName: app.title,
    url:'https://research.software/projects'
  }
}
```

Old SEO functions/components can be only used on client side ('use client'). There is no certainty how these work.

### CitationMeta

This is custom SEO header

### Canonical url

The canonical url can be added using metadata. [See this section for more details](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase).

## Robots txt and sitemap.xml

The [documentation about the robot.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

To see new approach using app folder look at `app-robots-sitemap`. I do not see any benefit of new approach. Old approach in pages can be used as long as we use api part. **This feature can be migrated as last**.

- The old approach in pages/sitemap works properly.

### New approach for partial sitemaps

- new approach functions are moved to sitemap folder
- apiSitemap.ts file created to hold server side methods used to create sitemap. These use headers from next to extract host information.
- apiOrganisationsSitemap to create organisation sitemap.xml
- apiProjectsSitemap to create organisation sitemap.xml
- apiSoftwareSitemap to create organisation sitemap.xml

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
