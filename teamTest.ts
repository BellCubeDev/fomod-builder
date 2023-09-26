enum Team {
    Red,
    Blue,
}

const teams = Object.values(Team).filter(t => typeof t === 'number') as Team[];

interface Player {
    name: string;
    team: Team;
    health: number;
    damage: number;
}

const players = [
    {
        name: 'Red Player',
        team: Team.Red,
        health: 100,
        damage: Math.floor( Math.random()*10 ) + 11,
    },
    {
        name: 'Blue Player',
        team: Team.Blue,
        health: 100,
        damage: Math.floor( Math.random()*10 ) + 11,
    },
] satisfies Player[];

let gameIsOver = false;

const intervalID = setInterval(CombatLoop, 1000);
CombatLoop();

function CombatLoop(){
    for (const attacker of players) {
        if (attacker.health <= 0) continue;

        const victim = players.find(t => t.team !== attacker.team && t.health > 0);
        if (!victim) continue;

        victim.health -= attacker.damage;
        console.log(`${attacker.name} hits ${victim.name} for ${attacker.damage} damage (${victim.health} health remaining)`);
    }

    for (const team of teams) {
        gameIsOver = players.filter(t => t.health > 0 && t.team !== team).length <= 0;
        if (gameIsOver) {
            clearInterval(intervalID);
            console.log('Game over!');
            break;
        }
    }
}

