---
# 🧪 Minecraft Bot Stress Tester

A **Mineflayer-based stress testing tool** for Minecraft servers.  
This script spawns multiple bots to **simulate player activity** and test how many players your server can handle before performance drops.  

## ✨ Features
- 🔹 Spawn any number of bots with a custom delay  
- 🔹 Interactive **command-line control**  
- 🔹 Supports **pathfinding & navigation** with [mineflayer-pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder)  
- 🔹 Bots can **chat, move, dig, place blocks, follow players, craft, attack, and more**  
- 🔹 Easy setup with a **Windows batch file (`run.bat`)**  
- 🔹 Perfect for **server stress/load testing**  

## 📦 Installation
### 🔹 Method 1 – Manual Setup
````bash
git clone https://github.com/yourusername/mc-bot-stress-tester.git
cd mc-bot-stress-tester
npm install
node botController.js
````
### 🔹 Method 2 – Windows (One Click)

If you’re on **Windows**, just run:

```
run.bat
```

This will:

1. Install all required dependencies (`npm install`).
2. Start the bot controller script automatically.

No extra setup needed 🚀

## ▶️ Usage

When running, you’ll be prompted for:

* **Server IP** (default: `localhost`)
* **Port** (default: `25565`)
* **Minecraft Version** (default: `1.21`)
* **Number of bots to spawn**
* **Delay between spawns (ms)**

Example:

```
Server IP (localhost): play.example.com
Port (25565):
Minecraft Version (1.21):
Number of bots to spawn (5): 50
Delay between spawns (ms) (2000): 100

Spawning 50 bots to play.example.com:25565...
```

This allows you to test how many players your server can handle.

## 💻 Commands

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `say <msg>`               | All bots send a chat message             |
| `say <id> <msg>`          | A specific bot sends a message           |
| `list`                    | Show all connected bots                  |
| `exit <id>`               | Disconnect a bot                         |
| `exit all`                | Disconnect all bots                      |
| `jump <id>`               | Make bot jump                            |
| `follow <id> <player>`    | Make bot follow a player                 |
| `stop <id>`               | Stop bot pathfinding                     |
| `tp <id> <x> <y> <z>`     | Teleport bot                             |
| `pos <id>`                | Show bot’s current position              |
| `dig <id>`                | Dig the block the bot is looking at      |
| `place <id>`              | Place block in hand above targeted block |
| `equip <id> <item>`       | Equip item in bot’s hand                 |
| `inv <id>`                | Show inventory contents                  |
| `look <id> <yaw> <pitch>` | Rotate bot’s view                        |
| `craft <id> <item> <n>`   | Craft item                               |
| `use <id>`                | Use/right-click with held item           |
| `attack <id>`             | Attack nearest entity                    |
| `help`                    | Show all commands                        |

## ⚠️ Notes

* Bots auto-run `/register <username>` and `/login <username>` on join.
* Edit in `bot.on('spawn', ...)` if your server uses different authentication.
* Each bot is named `TestBot_<id>` by default.
* This project is **for testing your own server performance only** – do not use it to disrupt others’ servers.

---
