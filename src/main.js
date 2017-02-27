//TODO global config
require('require');

module.exports.loop = function () {

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roles.harvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roles.upgrader.run(creep);
        }
        if (creep.memory.role == 'stucturer') {
            roles.stucturer.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roles.carrier.run(creep);
        }
    }

    var my_rooms = brain.memory.get_my_room_list();

    for(var room in my_rooms) {
        var memory = Memory.rooms[room];
        if(memory.controlled){
            var spawns = Game.rooms[room].find(FIND_MY_SPAWNS);
            if(!spawns) {
                console.log('Problem with room: ' + room + ' its controlled but no spawn found');
                return;
            }

            for(var i=0; i < spawns.length; i++) {
                //Do spawn stuff
                building.run(spawns[i]);
            }

            //Do tower code
            var towers = Game.rooms[room].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER, my: true}});
            towers.forEach(tower.run);
        }
    }
};


//
//var myRoom = Game.rooms['W2N5'];
//var spawns = myRoom.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
//for (i = 0; i < spawns.length; i++) {
//    roomSpawner.run(spawns[i]);
//}