'use client'

import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '@/styles/rsdMuiTheme'
import {RsdTheme} from './rsdMuiTheme'
import {Global} from '@emotion/react'

type RsdMuiThemeProviderProps = {
  rsdTheme: RsdTheme
  children: any
}

export default function RsdMuiThemeProvider({rsdTheme, children}: RsdMuiThemeProviderProps) {
  // create theme from settings
  const {muiTheme, cssVariables} = loadMuiTheme(rsdTheme)

  // console.group('RsdMuiThemeProvider')
  // console.log('muiTheme...', muiTheme)
  // console.log('cssVariables...',cssVariables)
  // console.groupEnd()

  return (
    <ThemeProvider theme={muiTheme}>
      {/* dynamically pass css variables when theme changes */}
      <Global styles={cssVariables} />
      {/* content */}
      {children}
    </ThemeProvider>
  )
}
