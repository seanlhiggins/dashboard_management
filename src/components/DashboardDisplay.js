import React, { useState, useEffect, useContext, useCallback }  from "react"
import { ExtensionContext } from '@looker/extension-sdk-react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {
    Box, Heading
} from '@looker/components'
import { EmbedContainer } from './EmbedContainer'

const DashboardDisplay = (props) => {
    const extensionContext = useContext(ExtensionContext)
    const [dashboard, setDashboard] = useState(undefined)
    const dashboardId = props.dashboard.toString()
    const setupDashboard = (d) => {
        props.setIsLoading(false)
        setDashboard(d)
    }

    const embedCtrRef = useCallback((el) => {
        const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
        if (el && hostUrl) {
            props.setIsLoading(true)
            el.innerHTML = ''
            LookerEmbedSDK.init(hostUrl)
            const dash = LookerEmbedSDK.createDashboardWithId(dashboardId)
            .withNext()
            .withFrameBorder()
            dash.appendTo(el)
                .build()
                .connect()
                .then((d) => setupDashboard(d))
                .catch((e) => {console.error('Connection error', e)})
            }
      },
      [props.dashboard]
    )


    return (
        <Box>
            {props.dashboard && 
                <>
                    <EmbedContainer ref={embedCtrRef}/>
                </>
            }
        </Box>
    )
}

export default DashboardDisplay;