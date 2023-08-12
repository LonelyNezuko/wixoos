import React from 'react'

import { IoClose } from 'react-icons/io5'

export default function Modal({ body, title, classes, styles, onClose }) {
    const [ _body, _setBody ] = React.useState()
    React.useEffect(() => {
        _setBody(body)
    }, [body])

    return (
        <div className={`modal ${classes}`}>
            <div className="modalWrapper" style={styles || {}}>
                <div className="modalHeader">
                    <h1 className="modalTitle">{title || 'title'}</h1>
                    <button className="modalClose" onClick={() => {
                        if(onClose) onClose()
                    }}>
                        <IoClose />
                    </button>
                </div>
                <div className="modalBody">
                    {body || 'body'}
                </div>
            </div>
        </div>
    )
}