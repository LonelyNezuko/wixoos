import React from 'react'
import $ from 'jquery'

import { FcFeedback } from 'react-icons/fc'

export default function Select({
    _type,
    _list = [],

    onChange
}) {
    const [ selected, setSelected ] = React.useState([ '', '' ])
    
    const [ type, setType ] = React.useState('')
    React.useEffect(() => {
        setType(_type)
        list.map(item => {
            if(item[0] === _type) {
                setSelected(item)
            }
        })
    }, [_type, type, _list])

    const [ list, setList ] = React.useState([])
    React.useEffect(() => {
        setList(_list)
    }, [_list])

    return (
        <div className="select" data-value={type}>
            {(selected[2] && typeof selected[2] !== 'string') ? (
                <div className="icon">{selected[2]}</div>
            ) : ''}
            {(selected[2] && typeof selected[2] === 'string') ? (
                <h1>{selected[2]}</h1>
            ) : ''}
            <h5 className="title" dangerouslySetInnerHTML={{__html: selected[1]}}></h5>
            <ul>
                {list.map((item, i) => {
                    return (<li onClick={event => {
                        if(onChange) onChange(item)
                    }} className={item[0] === type ? 'selected' : ''} key={i} data-value={item[0]}>
                        {(item[2] && typeof item[2] !== 'string') ? (
                            item[2]
                        ) : ''}
                        {(item[2] && typeof item[2] === 'string') ? (
                            <h1>{item[2]}</h1>
                        ) : ''}
                        <span dangerouslySetInnerHTML={{__html: item[1]}}></span>
                    </li>)
                })}
            </ul>
        </div>
    )
}