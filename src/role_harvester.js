'use strict';

/*
 * harvester makes sure that extensions are filled
 *
 * Before storage or certains store threshold:
 *  - get dropped energy or from source
 *  - fill extensions
 *  - build constructionSites
 *  - upgrade Controller
 *
 * Proper storage store level:
 *  - Move along the harvester path
 *  - pathPos === 0 get energy from storage
 *  - transfer energy to extensions in range
 */

roles.harvester = {};

/** @param {Creep} creep **/
roles.harvester.run = function(creep) {
        if(creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('unloading');
        }
        if(!creep.memory.unloading) {
            var source = creep.room.find(FIND_SOURCES_ACTIVE, {
                filter: (source) => {
                    return (source.id == creep.memory.source)
                }
            });
            if(source[0] && creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0]);
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(creep.room.memory.carriers > 0 || !target) {
                //drop it to harvest more
                //TODO better handling etc.
                creep.drop('energy', creep.carry.energy);
            } else {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    },


/** @param {Spawn} spawn **/
/** @param {source_id} id of the source **/
roles.harvester.build = function(spawn, source_id) {
    var pattern = [WORK,CARRY];
    var body = sc89functions.generate_body(pattern, spawn);
    if(spawn.canCreateCreep(body) == 0){
        console.log('Spawning Harvester for source: ' + source_id + ' with body: ' + JSON.stringify(body));
        spawn.createCreep(body, null, {role: 'harvester', source: source_id});
        return true;
    }
    return false;
};
