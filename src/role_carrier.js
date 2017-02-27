'use strict';

roles.carrier = {};

/** @param {Creep} creep **/
roles.carrier.run = function(creep) {
    var store_pos = creep.room.memory.controllers[creep.room.controller.id].store;

    if(creep.memory.unloading && creep.carry.energy == 0) {
        creep.memory.unloading = false;
        creep.say('Pickup');
    }
    if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.unloading = true;
        creep.say('Drop Off');
    }

    if(!creep.memory.unloading) {

        let room_sources =  Memory.rooms[creep.room.name].sources;
        for(var source in room_sources){
            if(Memory.rooms[creep.room.name].sources[source].workers > 0){
                source = id
            }
        }


        console.log('Sources: ' + JSON.stringify(source[0].id));
        console.log(creep.pos.getRangeTo(source.pos));
        if(creep.pos.getRangeTo(creep.memory.source) > 2) {
            creep.say('Moving');
            creep.moveTo(creep.memory.source);
            return;
        } else {

            var dropped_energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                filter: (energy) => {
                    return (energy.pos != ((creep.pos.x != store_pos.x) && (creep.pos.y != store_pos.y)));
                }
            });

            if (dropped_energy && creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped_energy);
                return;
            }
        }

    } else {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        if(target === null){
            if(creep.pos.getRangeTo(creep.room.controller) > 1) {
                creep.moveTo(store_pos.x, store_pos.y);
                return;
            } else {
                if(creep.carry.energy > 0){
                    creep.drop(RESOURCE_ENERGY);
                    creep.memory.unloading = false;
                    return;
                }
            }
        } else {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }
    }
};

/** @param {Spawn} spawn **/
/** @param {source_id} id of the source **/
roles.carrier.build = function(spawn, source_id) {
    var pattern = [MOVE,CARRY];
    var body = sc89functions.generate_body(pattern, spawn);
    if(spawn.canCreateCreep(body) == 0){
        console.log('Spawning carrier for source: ' + source_id + ' with body: ' + JSON.stringify(body));
        spawn.createCreep(body, null, {role: 'carrier', source: source_id, room: spawn.room.name});
        return true;
    }
    return false;
};
