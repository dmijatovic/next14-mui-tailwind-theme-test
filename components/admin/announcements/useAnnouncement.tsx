// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {AnnouncementItem, getAnnouncement} from './apiAnnouncement'


export default function useAnnouncement() {
  const {token} = useSession()
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState<AnnouncementItem|null>(null)

  useEffect(() => {
    let abort = false

    getAnnouncement(token).then(item => {
      if (abort) return
      setAnnouncement(item)
      setLoading(false)
    })

    return ()=>{abort=true}
  }, [token])

  return {
    announcement,
    loading
  }

}
