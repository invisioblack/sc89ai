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

    if(spawn.room.energyAvailable >= 300){

        let room_sources =  Memory.rooms[spawn.room.name].sources;
        for(var source in room_sources){
            if(Memory.rooms[spawn.room.name].sources[source].workers < 2){
                if(roles.harvester.build(spawn, source)){
                    Memory.rooms[spawn.room.name].sources[source].workers = Memory.rooms[spawn.room.name].sources[source].workers + 1;
                    return;
                }
            }
        }

        var workerBody = [], bodyIteration = [MOVE,MOVE,WORK,CARRY];
        while(sc89functions.calcBodyCost(workerBody) + sc89functions.calcBodyCost(bodyIteration) <= spawn.room.energyAvailable && workerBody.length + bodyIteration.length <= MAX_CREEP_SIZE) {
            workerBody = workerBody.concat(bodyIteration);
        }

        //check the controller has 2 upgraders
        if(spawn.room.controller.memory.workers < 2){
            if(roles.upgrader.build(spawn, spawn.room.controller)){
                spawn.room.controller.memory.workers = spawn.room.controller.memory.workers + 1;
                return;
            }
        }

        //check the room has 2 carriers
        if(spawn.room.memory.carriers < 2){
            if(roles.carrier.build(spawn, spawn.room.controller.id)){
                spawn.room.memory.carriers = spawn.room.memory.carriers + 1;
                return;
            }
        }

        if(spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            spawn.createCreep(workerBody, 'b1', {role: 'stucturer'});
            spawn.createCreep(workerBody, 'b2', {role: 'stucturer'});
            spawn.createCreep(workerBody, 'b3', {role: 'stucturer'});
        }

    }
};