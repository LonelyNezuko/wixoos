import React from 'react'
import './avatar.scss'

export default function Avatar(props) {
    let imgStyle = {}

    if(props.position) {
        imgStyle.left = props.position.x + '%'
        imgStyle.top = props.position.y + '%'
    }
    if(props.size) {
        imgStyle.width = props.size + '%'
        imgStyle.height = props.size + '%'
    }

    return (
        <div className={`avatar ${props.type ? 'avatar-' + props.type : ''} ${[props.class ? props.class : '']}`} style={props.borderRadius ? {borderRadius: props.borderRadius} : {}}>
            <div className="avatarWrapper">
                <img src={props.image} alt="Avatar" style={imgStyle} />
            </div>
            {props.code ? props.code : ''}
        </div>
    )
}

