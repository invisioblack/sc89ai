function getRandomFreePos(startPos, distance) {
    var x,y;
    do {
        x = startPos.x + Math.floor(Math.random()*(distance*2+1)) - distance;
        y = startPos.y + Math.floor(Math.random()*(distance*2+1)) - distance;
    }
    while((x+y)%2 != (startPos.x+startPos.y)%2 || Game.map.getTerrainAt(x,y,startPos.roomName) == 'wall');
    return new RoomPosition(x,y,startPos.roomName);
}

function build(spawn, structureType) {
    var structures = spawn.room.find(FIND_STRUCTURES, {filter: {structureType, my: true}});
    for(var i=0; i < CONTROLLER_STRUCTURES[structureType][spawn.room.controller.level] - structures.length; i++) {
        getRandomFreePos(spawn.pos, 5).createConstructionSite(structureType);
    }
}


exports.run = function(spawn) {
    //build(spawn, STRUCTURE_EXTENSION);
    //build(spawn, STRUCTURE_TOWER);
    sc89functions.planWalls(spawn.room);
    sc89functions.checkStore(spawn.room);
    sc89functions.buildRoads(spawn.room);


    if(spawn.room.energyAvailable >= 300){

        let room_sources =  Memory.rooms[spawn.room.name].sources;
        for(var source in room_sources){
            if(Memory.rooms[spawn.room.name].sources[source].workers < config.creep_counts.harvester){
                if(roles.harvester.build(spawn, source)){
                    Memory.rooms[spawn.room.name].sources[source].workers = Memory.rooms[spawn.room.name].sources[source].workers + 1;
                    return;
                }
            }
        }

        //check the controller has 2 upgraders
        if(spawn.room.controller.memory.workers < config.creep_counts.upgrader){
            if(roles.upgrader.build(spawn, spawn.room.controller)){
                spawn.room.controller.memory.workers = spawn.room.controller.memory.workers + 1;
                return;
            }
        }

        //check the room has 2 carriers
        if(spawn.room.memory.carriers < config.creep_counts.carrier){
            if(roles.carrier.build(spawn, spawn.room.controller.id)){
                spawn.room.memory.carriers = spawn.room.memory.carriers + 1;
                return;
            }
        }

        //check the room has 1 fixer
        if(spawn.room.memory.fixer < config.creep_counts.fixer){
            if(roles.fixer.build(spawn, spawn.room.controller.id)){
                spawn.room.memory.fixer = spawn.room.memory.fixer + 1;
                return;
            }
        }

        if(spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            spawn.createCreep(workerBody, 'b1', {role: 'stucturer'});
            spawn.createCreep(workerBody, 'b2', {role: 'stucturer'});
        }

    }
};