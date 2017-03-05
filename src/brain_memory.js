brain.memory = {};


// The purpose of this function is to add my rooms to memory, so that rooms can be filtered from memory rather than looping from Game.Spawns and doing checks that way
brain.memory.get_my_room_list = function () {

    //Get the list of rooms we have in memory
    //This list will include all scouted rooms eventually
    var room_list = Memory.rooms;

    if (!Memory.last_room_refresh) {
        Memory.last_room_refresh = Game.time;
    }

    //if there is no room list we must have removed it or were starting fresh
    if (!Memory.rooms) {
        this.build_rooms(false);
    }
    if ((Game.time - 30) > Memory.last_room_refresh) {
        this.build_rooms(true);
    }

    //Loop through all rooms your creeps/structures are in
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
    }

    var my_rooms = {};
    for (var room in Memory.rooms) {
        var memory = Memory.rooms[room];
        if (memory.controlled) {
            my_rooms[room] = memory;
        }
    }
    return my_rooms;
};

brain.memory.build_rooms = function (refresh) {
    if (refresh) {
        console.log('preforming a refresh');
    }

    //Loop through all rooms your creeps/structures are in
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        //Do sources
        brain.memory.do_sources(room, refresh);
        brain.memory.do_carriers(room, refresh);
        brain.memory.do_fixer(room, refresh);
        brain.memory.do_controllers(room, refresh);
        brain.memory.check_controlled(room, refresh);
        brain.memory.check_reserved(room, refresh);
        brain.memory.do_roads(room, refresh);
    }

    Memory.last_room_refresh = Game.time;
};

brain.memory.do_sources = function (room, refresh) {
    Source.prototype.memory = undefined;
    //If this room has no sources memory yet
    if (!room.memory.sources) {
        //Add it
        room.memory.sources = {};
        //Find all sources in the current room
        var sources = room.find(FIND_SOURCES);
        for (var i in sources) {
            var source = sources[i];
            //Create a new empty memory object for this source
            source.memory = room.memory.sources[source.id] = {};
            //Now you can do anything you want to do with this source
            //for example you could add a worker counter:
            source.memory.workers = 0;
        }
    } else {
        //The memory already exists so lets add a shortcut to the sources its memory
        //Find all sources in the current room
        var sources = room.find(FIND_SOURCES);
        for (var i in sources) {
            var source = sources[i];
            //Set the shortcut
            source.memory = room.memory.sources[source.id];

            //Check what workers are working in this room at this source
            if (refresh) {
                let workers = _.filter(Game.creeps, {
                    memory: {
                        role: 'harvester',
                        source: source.id
                    }
                });
                source.memory.workers = _.size(workers);
            }
        }
    }
    return;
};

brain.memory.do_carriers = function (room, refresh) {
    //If this room has no sources memory yet
    if (!room.memory.carriers || refresh) {
        //Add it
        room.memory.carriers = {};
        let carriers = _.filter(Game.creeps, {
            memory: {
                role: 'carrier',
                room: room.name
            }
        });
        console.log()
        room.memory.carriers = _.size(carriers);
    }
    return;
};

brain.memory.do_fixer = function (room, refresh) {
    //If this room has no sources memory yet
    if (!room.memory.fixer || refresh) {
        //Add it
        room.memory.fixer = {};
        let fixers = _.filter(Game.creeps, {
            memory: {
                role: 'fixer',
                room: room.name
            }
        });
        console.log()
        room.memory.fixer = _.size(fixers);
    }
    return;
};

brain.memory.do_controllers = function (room, refresh) {
    //Check there is a controller because there are rooms without
    if(room.controller !== undefined) {
        //If this room has no controller memory yet
        if (!room.memory.controllers) {
            //Add it
            room.memory.controllers = {};
            room.controller.memory = room.memory.controllers[room.controller.id] = {};
            room.controller.memory.workers = 0;
            room.controller.memory.store = sc89functions.posNear(room.controller.pos.x, room.controller.pos.y);
        } else {
            //The memory already exists so lets add a shortcut to the sources its memory
            //Set the shortcut
            room.controller.memory = room.memory.controllers[room.controller.id];
            //Check what workers are working in this room at this source
            if (refresh) {
                let workers = _.filter(Game.creeps, {
                    memory: {
                        role: 'upgrader',
                        target: room.controller.id
                    }
                });
                //just if the position is removed manually it will get re-added next time it refreshes
                if(!room.controller.memory.store){
                    room.controller.memory.store = sc89functions.posNear(room.controller.pos.x, room.controller.pos.y, room);
                }
                room.controller.memory.workers = _.size(workers);
            }
        }
    }

    // if(config.visuals){
    //     for (var n = 0; n < pos_free.length; n++) {
    //         Game.rooms[room.name].visual.drawCross(pos_free[n].x,pos_free[n].y, {color: '#ff0000'});
    //     }
    // }
    return;
};

brain.memory.do_roads = function(room, refresh){
    if(!room.memory.roads || refresh){
        room.memory.roads = sc89functions.planRoads(room);
    }
};

brain.memory.check_controlled = function (room, refresh) {
    if (!room.memory.controlled || refresh) {
        if (!room.controller.my) {
            room.memory.controlled = false;
        } else {
            room.memory.controlled = true;
        }
    }
};

brain.memory.check_reserved = function (room, refresh) {
    if (!room.memory.reserved || refresh) {
        if (!room.controller.reservation) {
            room.memory.reserved = false;
        } else {
            room.memory.reserved = true;
        }
    }
};

