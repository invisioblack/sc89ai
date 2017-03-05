roles.upgrader = {};

/** @param {Creep} creep **/
roles.upgrader.run = function (creep) {

    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('harvesting');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('upgrading');
    }

    if (creep.memory.upgrading) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    else {
        //if(creep.pos.getRangeTo(room.controller) )
        //if(creep.room.memory.carriers > 0) {
        //    //wait on delivery.
        //    creep.say('Waiting');
        //    return;
        //}


        var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
            return;
        }

        var dropped_energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
        if (dropped_energy && creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped_energy);
            return;
        }

        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};


/** @param {Spawn} spawn **/
/** @param {source_id} id of the source **/
roles.upgrader.build = function(spawn, controller) {
    var pattern = {
        move: 2,
        work: 15,
        carry: 5
    };
    var body = sc89functions.generate_body(pattern, spawn);
    if(spawn.canCreateCreep(body) == 0 && spawn.spawning === null){
        console.log('Spawning upgrader for controller with body: ' + JSON.stringify(body));
        spawn.createCreep(body.sort(), null, {role: 'upgrader', target: controller.id});
        return true;
    }
    return false;
};
