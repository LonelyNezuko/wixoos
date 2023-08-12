import React from 'react'
import $ from 'jquery'

import ragemp from '../../../modules/ragemp'

export default function InventoryContext({ toggle, position, item, condition, slot, setItemSelect }) {
    if(!toggle)return (<></>)
    console.log(condition)
    return (
        <div className="inventorycontext" style={{top: position[0] + "px", left: position[1] + "px"}}>
            <div className="header">
                <div className="icon">
                    <div className="inventory-elem">
                        <div className="inventory-elem-img">
                            <img src={`assets/inventory/items/${item.img}`} />
                        </div>
                    </div>
                </div>
                <div className="desc">
                    <div className="title">{item.name}</div>
                    <div className="stats">
                        <section>
                            <h1>Состояние:</h1>
                            <span className={`itemcondition ${condition}`}></span>
                        </section>
                        <section>
                            <h1>Вес:</h1>
                            <span>{item.weight} кг</span>
                        </section>
                    </div>
                </div>
            </div>
            <div className="info" dangerouslySetInnerHTML={{__html: item.desc}}></div>
            {item.weaponstats ? (
                <div className="weaponstats">
                    <section>
                        <h1>Урон:</h1>
                        <div>
                            <div style={{display: !item.weaponstats[0] ? 'none' : 'block', width: (item.weaponstats[0] * 100) / 5 + "%"}}></div>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </section>
                    <section>
                        <h1>Скорость:</h1>
                        <div>
                            <div style={{display: !item.weaponstats[1] ? 'none' : 'block', width: (item.weaponstats[1] * 100) / 5 + "%"}}></div>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </section>
                    <section>
                        <h1>Точность:</h1>
                        <div>
                            <div style={{display: !item.weaponstats[2] ? 'none' : 'block', width: (item.weaponstats[2] * 100) / 5 + "%"}}></div>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </section>
                    <section>
                        <h1>Дистанция:</h1>
                        <div>
                            <div style={{display: !item.weaponstats[3] ? 'none' : 'block', width: (item.weaponstats[3] * 100) / 5 + "%"}}></div>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </section>
                </div>
            ) : ''}
            <div className="action">
                <div className="btn" onClick={() => ragemp.send('server::menu:inventory:use', { slot })}>Использовать</div>
                <div className="btn" onClick={() => ragemp.send('server::menu:inventory:use', { slot })}>Выбросить</div>
                <div className="btn">Закрыть</div>
            </div>
        </div>
    )
}