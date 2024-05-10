import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

import { AuthProvider } from '~/auth/AuthProvider'
import { getSessionSeverSide } from '~/auth/getSessionServerSide'
import { getSettingsServerSide } from '~/config/getSettingsServerSide'
import { RsdSettingsProvider } from '~/config/RsdSettingsContext'
import RsdThemeProvider from '~/styles/RsdThemeProvider'
import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'

import '~/styles/global.css'
import Announcement from '~/components/Announcement/Announcement'
import { getMatomoSettings } from '~/components/cookies/getMatomoSettings'
import CookieConsentMatomo from '~/components/cookies/CookieConsentMatomo'
import MatomoScript from '~/components/cookies/MatomoScript'

// Get token refresh margin from env
const refreshMarginInMs = process.env.REFRESH_MARGIN_MSEC ? parseInt(process.env.REFRESH_MARGIN_MSEC) : undefined

export const metadata: Metadata = {
  title: 'MUI & Tailwind RSD test app',
  description: 'Test app folder implementation with RSD styles and auth approach',
}

// SERVER SIDE component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // extract nonce from request header
  // the nonce and CSP are added by middleware.ts
  const nonce = headers().get('x-nonce')

  // load settings.json, session from cookie and matomo settings
  const [settings, session, matomo] = await Promise.all([
    getSettingsServerSide(),
    getSessionSeverSide(),
    getMatomoSettings()
  ])

  console.group('RootLayout')
  // console.log('settings...', settings)
  // console.log('session...', session)
  console.log('matomo...', matomo)
  console.log('nonce...', nonce)
  console.log('refreshMarginInMs...', refreshMarginInMs)
  console.groupEnd()

  return (
    <html lang="en">
      <head>
        {/* PWA manifest.json for favicons */}
        <link rel="manifest" href="/manifest.json" />
        {/* mounted index.css with font definitions */}
        {/*eslint-disable-next-line @next/next/no-css-tags*/}
        <link href="/styles/index.css" rel="stylesheet" />
        {/* inject matomo script */}
        <MatomoScript matomo={matomo} nonce={nonce} />
      </head>
      <body className="dark">
        <AppRouterCacheProvider>
          <RsdThemeProvider rsdTheme={settings.theme}>
            {/* RSD settings/config */}
            <RsdSettingsProvider settings={settings}>
              {/* Authentication */}
              <AuthProvider session={session} refreshMarginInMs={refreshMarginInMs}>
                {/* MUI snackbar service */}
                <MuiSnackbarProvider>
                  {/* App header */}
                  <AppHeader />
                  {/* App main */}
                  {children}
                  {/* App footer*/}
                  <AppFooter
                    host={settings.host}
                    links={settings.links}
                    pages={settings.pages}
                  />
                </MuiSnackbarProvider>
              </AuthProvider>
            </RsdSettingsProvider>
            {/* Matomo cookie consent dialog */}
            <CookieConsentMatomo matomo={matomo} />
            {/* RSD admin announcements/ system notifications */}
            <Announcement announcement={settings?.announcement ?? null} />
          </RsdThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
