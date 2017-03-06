'use strict';

roles.fixer = {};

/** @param {Creep} creep **/
roles.fixer.run = function(creep) {
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

        var dropped_energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (energy) => {
                return (energy.pos != ((creep.pos.x != store_pos.x) && (creep.pos.y != store_pos.y)));
            }
        });

        //TODO SOmthing is wrong with the below check for capcity because they are still dancing like fucking fannies.
        //check for dropped energy and check to see it would fill our capacity.
        // && ((dropped_energy.energy + creep.carry.energy) >=  (creep.carryCapacity - creep.carry.energy))
        if (dropped_energy && (creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE)) {
            creep.moveTo(dropped_energy);
            return;
        } else {
            var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
                return;
            }
        }

    } else {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
        });

        if(target){
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return;
            }
        }
        return;
    }
};

/** @param {Spawn} spawn **/
/** @param {source_id} id of the source **/
roles.fixer.build = function(spawn) {
    var pattern = {
        move: 5,
        carry: 10,
        work: 10
    };
    var body = sc89functions.generate_body(pattern, spawn);
    if(spawn.canCreateCreep(body) == 0 && spawn.spawning === null){
        console.log('Spawning fixer for source: ' + spawn.room.name + ' with body: ' + JSON.stringify(body));
        spawn.createCreep(body.sort(), null, {role: 'fixer', room: spawn.room.name});
        return true;
    } else {
        console.log('Problem spawning fixer');
    }
    return false;
};
