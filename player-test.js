const mineflayer = require('mineflayer');
const readline = require('readline');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcDataCache = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultValue) {
  return new Promise(resolve => {
    rl.question(`${question} (${defaultValue}): `, input => {
      resolve(input.trim() || defaultValue);
    });
  });
}

const bots = {};

async function main() {
  const ip = await ask('Server IP', 'localhost');
  const port = parseInt(await ask('Port', '25565'));
  const version = await ask('Minecraft Version', '1.21');
  const count = parseInt(await ask('Number of bots to spawn', '5'));
  const delay = parseInt(await ask('Delay between spawns (ms)', '2000'));

  console.log(`\nSpawning ${count} bots to ${ip}:${port}...\n`);

  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnBot(i, ip, port, version), i * delay);
  }

  setupCommandInterface();
}

function spawnBot(id, ip, port, version) {
  const bot = mineflayer.createBot({
    host: ip,
    port: port,
    username: `TestBot_${id}`,
    version: version,
  });

  bot.loadPlugin(pathfinder);
  bot.on('spawn', () => {
    console.log(`TestBot_${id} connected.`);
    bot.chat(`/register TestBot_${id}`);
    bot.chat(`/login TestBot_${id}`);

    bot.defaultMove = new Movements(bot);
    if (!mcDataCache[version]) {
      mcDataCache[version] = require('minecraft-data')(version);
    }
    bot.mcData = mcDataCache[version];
  });

  bot.on('end', () => {
    console.log(`TestBot_${id} disconnected.`);
    delete bots[id];
  });

  bot.on('error', (err) => {
    console.log(`TestBot_${id} error: ${err.message}`);
  });

  bots[id] = bot;
}

function setupCommandInterface() {
  rl.setPrompt('Command> ');
  rl.prompt();

  rl.on('line', async (input) => {
    const args = input.trim().split(' ');
    const cmd = args.shift()?.toLowerCase();

    switch (cmd) {
      case 'say':
        if (!args.length) {
          console.log('Usage: say <msg> or say <id> <msg>');
        } else if (!isNaN(args[0])) {
          const id = args.shift();
          const msg = args.join(' ');
          bots[id]?.chat(msg) ?? console.log(`Bot ${id} not found.`);
        } else {
          const msg = args.join(' ');
          for (const id in bots) bots[id].chat(msg);
        }
        break;

      case 'exit':
        if (args[0] === 'all') {
          for (const id in bots) bots[id].end();
        } else {
          const id = args[0];
          bots[id]?.end() ?? console.log(`Bot ${id} not found.`);
        }
        break;

      case 'list':
        console.log(`Active bots: ${Object.keys(bots).join(', ') || 'None'}`);
        break;

      case 'jump':
        {
          const bot = bots[args[0]];
          bot?.setControlState('jump', true);
          setTimeout(() => bot?.setControlState('jump', false), 500);
        }
        break;

      case 'follow':
        {
          const [id, playerName] = args;
          const bot = bots[id];
          const target = bot?.players[playerName]?.entity;
          if (bot && target) {
            bot.pathfinder.setMovements(bot.defaultMove);
            bot.pathfinder.setGoal(new goals.GoalFollow(target, 1));
            console.log(`Bot ${id} following ${playerName}`);
          } else console.log(`Bot or player not found.`);
        }
        break;

      case 'stop':
        {
          const bot = bots[args[0]];
          bot?.pathfinder.setGoal(null);
        }
        break;

      case 'tp':
        {
          const [id, x, y, z] = args;
          const bot = bots[id];
          if (bot && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
            bot.chat(`/tp ${x} ${y} ${z}`);
          } else console.log('Usage: tp <id> <x> <y> <z>');
        }
        break;

      case 'pos':
        {
          const bot = bots[args[0]];
          if (bot) {
            const pos = bot.entity.position;
            console.log(`${args[0]}: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
          } else console.log('Bot not found.');
        }
        break;

      case 'dig':
        {
          const bot = bots[args[0]];
          const block = bot?.blockAtCursor(5);
          if (bot && block) {
            bot.dig(block).catch(err => console.log(`Dig error: ${err.message}`));
          } else console.log('No block to dig or bot not found.');
        }
        break;

      case 'place':
        {
          const bot = bots[args[0]];
          const refBlock = bot?.blockAtCursor(5);
          if (bot && refBlock) {
            bot.placeBlock(refBlock, { x: 0, y: 1, z: 0 }).catch(err => console.log(`Place error: ${err.message}`));
          } else console.log('Cannot place block.');
        }
        break;

      case 'equip':
        {
          const [id, itemName] = args;
          const bot = bots[id];
          const item = bot?.inventory.items().find(i => i.name === itemName);
          if (bot && item) {
            bot.equip(item, 'hand').catch(err => console.log(`Equip error: ${err.message}`));
          } else console.log('Item or bot not found.');
        }
        break;

      case 'inv':
        {
          const bot = bots[args[0]];
          if (bot) {
            bot.inventory.items().forEach(item => {
              console.log(`- ${item.name} x${item.count}`);
            });
          } else console.log('Bot not found.');
        }
        break;

      case 'look':
        {
          const [id, yaw, pitch] = args;
          const bot = bots[id];
          if (bot) {
            bot.look(parseFloat(yaw), parseFloat(pitch), true);
          } else console.log('Bot not found.');
        }
        break;

      case 'craft':
        {
          const [id, itemName, amountRaw] = args;
          const bot = bots[id];
          const amount = parseInt(amountRaw) || 1;
          const item = bot?.mcData.itemsByName[itemName];
          const recipe = item && bot.recipesFor(item.id, null, 1)[0];
          if (bot && recipe) {
            bot.craft(recipe, amount, null).then(() => {
              console.log(`Crafted ${amount}x ${itemName}`);
            }).catch(err => console.log(`Craft error: ${err.message}`));
          } else console.log(`Recipe for ${itemName} not found.`);
        }
        break;

      case 'use':
        {
          const bot = bots[args[0]];
          bot?.activateItem();
        }
        break;

      case 'attack':
        {
          const bot = bots[args[0]];
          const target = bot?.nearestEntity();
          if (bot && target) {
            bot.attack(target);
            console.log(`⚔️ Attacking ${target.name || 'entity'}`);
          } else console.log('No entity or bot not found.');
        }
        break;

      case 'help':
        console.log(`
  Commands:
  say <msg>               → All bots say message
  say <id> <msg>          → One bot says message
  exit <id>|all           → Disconnect bot(s)
  list                    → Show connected bots
  jump <id>               → Make bot jump
  follow <id> <player>    → Bot follows player
  stop <id>               → Stop bot path
  tp <id> <x> <y> <z>     → Bot runs /tp
  pos <id>                → Print position
  dig <id>                → Bot digs block it looks at
  place <id>              → Place block from hand
  equip <id> <item>       → Equip item in hand
  inv <id>                → List inventory
  look <id> <yaw> <pitch> → Look direction
  craft <id> <item> <n>   → Craft item
  use <id>                → Right-click/use item
  attack <id>             → Attack entity
        `);
        break;

      default:
        console.log('Unknown command. Type `help`.');
    }

    rl.prompt();
  });
}

main();
