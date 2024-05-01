import type {Metadata} from 'next'

import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter'

import {getSettingsServerSide} from '@/config/getSettingsServerSide'
import RsdThemeProvider from '@/styles/RsdThemeProvider'
import {RsdSettingsProvider} from '@/config/RsdSettingsContext'

import {getSessionSeverSide} from '@/auth/getSessionServerSide'
import {AuthProvider} from '@/auth/AuthProvider'

import '@/styles/global.css'
import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'
import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'

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

  // load RSD settings from settings.json
  const settings = await getSettingsServerSide()
  const session = await getSessionSeverSide()

  console.group('RootLayout')
  // console.log('settings...', settings)
  console.log('session...', session)
  console.groupEnd()

  return (
    <html lang="en">
      <head>
        {/* PWA manifest.json for favicons */}
        <link rel="manifest" href="/manifest.json" />
        {/* mounted index.css with font definitions */}
        {/*eslint-disable-next-line @next/next/no-css-tags*/}
        <link href="/styles/index.css" rel="stylesheet" />
      </head>
      <body className="dark">
        <AppRouterCacheProvider>
          <RsdThemeProvider rsdTheme={settings.theme}>
            {/* RSD settings/config */}
            <RsdSettingsProvider settings={settings}>
              {/* Authentication */}
              <AuthProvider session={session}>
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
          </RsdThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
