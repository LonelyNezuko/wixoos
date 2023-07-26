mp.events.add("entityStreamIn", (entity: EntityMp | PlayerMp) => {
    if(entity.type === RageEnums.EntityType.PLAYER
        && entity !== mp.players.local) {
        const props = entity.getVariable('props') || [ -1, -1, -1, -1, -1 ]
        
        props.map((item: any, i: number) => {
            let index = i

            if(i === 3) index = 6
            else if(i === 4) index = 7

            if(item === -1) entity.clearProp(index)
            else if(item.id) entity.setPropIndex(index, item.id, item.texture, true)
        })
    }
})