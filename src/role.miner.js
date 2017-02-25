var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            creep.drop('energy', creep.carry.energy);
        }
    }
};

module.exports = roleMiner;

//Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );