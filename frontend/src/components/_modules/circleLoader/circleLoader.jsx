import React from 'react'

import './circleLoader.scss'

export default function CircleLoader({ type }) {
    return (
        <div class={`circleLoader circleLoaderType-${type}`}>
            <span></span>
        </div>
    )
}