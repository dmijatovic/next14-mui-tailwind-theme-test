// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState, useEffect, MouseEvent} from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
// local dependencies (project components)
import {useSession} from '~/auth/AuthProvider'
import useDisableScrollLock from '~/utils/useDisableScrollLock'
import {menuItems} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import LoginButton from '~/components/login/LoginButton'
import GlobalSearchAutocomplete from '~/components/GlobalSearchAutocomplete'
import FeedbackPanelButton from '~/components/feedback/FeedbackPanelButton'
import LogoApp from './LogoApp'
import LogoAppSmall from './LogoAppSmall'
import AddMenu from './AddMenu'
import JavascriptSupportWarning from './JavascriptSupportWarning'
import isActiveMenuItem from './isActiveMenuItem'

export default function AppHeader() {
  const [activePath, setActivePath] = useState('/')
  const session = useSession()
  const status = session?.status || 'loading'
  const {host} = useRsdSettings()
  const disable = useDisableScrollLock()
  // Responsive menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    // set activePath to currently loaded route/page
    if (typeof window != 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  // Responsive menu
  const open = Boolean(anchorEl)
  const handleClickResponsiveMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseResponsiveMenu = () => {
    setAnchorEl(null)
  }

  return (
    <header
      data-testid="app-header"
      className="z-10 py-4 min-h-[6rem] bg-secondary text-primary-content flex items-center flex-wrap"
    >
      {/* keep these styles in sync with main in MainContent.tsx */}
      <div
        className="flex-1 flex flex-col px-4 xl:flex-row items-start lg:container lg:mx-auto">
        <div className="w-full flex-1 flex items-center justify-between">
          <Link href="/" passHref className="hover:text-inherit" aria-label="Link to home page">
            <LogoApp
              className="hidden 2xl:block"
              // loading='eager'
              // lighthouse audit requires explicit width and height
              width="100%"
              height="1.5rem"
            />
            <LogoAppSmall
              className="2xl:hidden"
              // loading='eager'
              // lighthouse audit requires explicit width and height
              width="7rem"
              height="1.5rem"
            />
          </Link>

          <GlobalSearchAutocomplete className="hidden xl:block ml-12 mr-6"/>

          {/* Large menu*/}
          <div
            className="justify-center xl:justify-start hidden md:flex text-lg ml-4 gap-5 text-center opacity-90 font-normal flex-1">
            {menuItems.map(item => {
              const isActive = isActiveMenuItem({item, activePath})
              return (
                <Link key={item.path} href={item.path ?? ''} className={`${isActive ? 'nav-active' : ''}`}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="text-primary-content flex gap-2 justify-end items-center min-w-[8rem] text-right ml-4">


            {/* FEEDBACK panel */}
            <div className="hidden md:block">
              {host.feedback?.enabled
                ? <FeedbackPanelButton feedback_email={host.feedback.url} issues_page_url={host.feedback.issues_page_url} />
                : null
              }
            </div>

            {/* ADD menu button */}
            {status === 'authenticated' ? <AddMenu/> : null}


            {/* Responsive menu */}
            <div className="flex items-center md:hidden">
              <IconButton
                size="large"
                title="Menu"
                data-testid="menu-button"
                aria-label="menu button"
                onClick={handleClickResponsiveMenu}
                sx={{
                  color: 'primary.contrastText',
                  alignSelf: 'center',
                  '&:focus-visible': {
                    outline: 'auto'
                  }
                }}
              >
                <MenuIcon/>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseResponsiveMenu}
                MenuListProps={{
                  'aria-labelledby': 'menu-button',
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                // disable adding styles to body (overflow:hidden & padding-right)
                disableScrollLock = {disable}
              >
                {menuItems.map(item => {
                  const isActive = isActiveMenuItem({item, activePath})
                  return (
                    <MenuItem onClick={handleCloseResponsiveMenu} key={item.path}>
                      <Link href={item.path ?? ''} className={`${isActive ? 'nav-active' : ''}`}>
                        {item.label}
                      </Link>
                    </MenuItem>
                  )
                })}
                <li>
                  {host.feedback?.enabled
                    ? <FeedbackPanelButton feedback_email={host.feedback.url} issues_page_url={host.feedback.issues_page_url} />
                    : null
                  }
                </li>
              </Menu>
            </div>

            {/* LOGIN / USER MENU */}
            <LoginButton/>
          </div>
        </div>
        <GlobalSearchAutocomplete className="xl:hidden mt-4"/>
      </div>
      <JavascriptSupportWarning/>
    </header>
  )
}
