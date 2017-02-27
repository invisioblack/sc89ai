roles.stucturer = {};

/** @param {Creep} creep **/
roles.stucturer.run = function(creep) {

    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('harvesting');
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('building');
    }

    if(creep.memory.building) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return;
            }
        }

        var repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (object) {
                return object.hits < object.hitsMax;
            }
        });


    } else {
        var dropped_energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
        if (dropped_energy && creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped_energy);
            return;
        }

        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};