

var construction = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
for (i = 0; i < construction.length; i++) {
    console.log('Trying to remove: '+i);
    construction[i].remove();
}
