import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {

    console.log('🌱 Starting seed...')

    // -----------------------------
    // 1. Clean database
    // -----------------------------

    await prisma.game.deleteMany()
    await prisma.console.deleteMany()

    console.log('🧹 Database cleaned')

    // -----------------------------
    // 2. Create Consoles
    // -----------------------------

    const consoles = await prisma.console.createMany({
        data: [
            {
                name: 'PlayStation 5',
                manufacturer: 'Sony Interactive Entertainment',
                releasedate: new Date('2020-11-12'),
                description:
                    'The PlayStation 5 (PS5) is a home video game console bringing 4K gaming at 120Hz and ray tracing support.',
            },
            {
                name: 'Xbox Series X',
                manufacturer: 'Microsoft',
                releasedate: new Date('2020-11-10'),
                description:
                    'The Xbox Series X is a high-performance console, featuring a custom AMD processor and 12 TFLOPS of graphical power.',
            },
            {
                name: 'Nintendo Switch OLED Model',
                manufacturer: 'Nintendo',
                releasedate: new Date('2021-10-08'),
                description:
                    'A hybrid console that can be used as a home console and a portable handheld device, now with a vibrant OLED screen.',
            },
            {
                name: 'Nintendo Switch 2',
                manufacturer: 'Nintendo',
                releasedate: new Date('2025-06-05'),
                description:
                    'The successor to the popular Nintendo Switch, featuring larger magnetic Joy-cons and enhanced performance.',
            },
            {
                name: 'Steam Deck OLED',
                manufacturer: 'Valve',
                releasedate: new Date('2023-11-16'),
                description:
                    'A powerful handheld gaming computer that plays PC games from your Steam library on the go.',
            },
        ],
    })

    console.log('🎮 5 consoles seeded')

    // -----------------------------
    // 3. Get consoles from DB
    // -----------------------------

    const allConsoles = await prisma.console.findMany()

    const ps5 = allConsoles.find(c => c.name === 'PlayStation 5')
    const xbox = allConsoles.find(c => c.name === 'Xbox Series X')
    const switchOLED = allConsoles.find(c => c.name === 'Nintendo Switch OLED Model')
    const switch2 = allConsoles.find(c => c.name === 'Nintendo Switch 2')
    const steamDeck = allConsoles.find(c => c.name === 'Steam Deck OLED')

    // -----------------------------
    // 4. Create Games
    // -----------------------------

    const gamesData = [
    {
        title: 'God of War Ragnarök',
        developer: 'Santa Monica Studio',
        releasedate: new Date('2022-11-09'),
        price: 69.99,
        genre: 'Action-adventure',
        description: 'Kratos and Atreus face Ragnarök across the Nine Realms.',
        console_id: ps5?.id,
    },
    {
        title: 'Halo Infinite',
        developer: '343 Industries',
        releasedate: new Date('2021-12-08'),
        price: 59.99,
        genre: 'First-person shooter',
        description: 'Master Chief returns in an expansive campaign.',
        console_id: xbox?.id,
    },
    {
        title: 'The Legend of Zelda: Tears of the Kingdom',
        developer: 'Nintendo EPD',
        releasedate: new Date('2023-05-12'),
        price: 69.99,
        genre: 'Action-adventure',
        description: 'Explore the skies and land of Hyrule.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Elden Ring',
        developer: 'FromSoftware',
        releasedate: new Date('2022-02-25'),
        price: 59.99,
        genre: 'Action role-playing',
        description: 'A vast dark fantasy world to explore.',
        console_id: ps5?.id,
    },
    {
        title: 'Forza Horizon 5',
        developer: 'Playground Games',
        releasedate: new Date('2021-11-09'),
        price: 59.99,
        genre: 'Racing',
        description: 'Open-world racing in Mexico.',
        console_id: xbox?.id,
    },
    {
        title: 'Pokémon Scarlet',
        developer: 'Game Freak',
        releasedate: new Date('2022-11-18'),
        price: 59.99,
        genre: 'Role-playing',
        description: 'Explore Paldea region.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Marvel’s Spider-Man 2',
        developer: 'Insomniac Games',
        releasedate: new Date('2023-10-20'),
        price: 69.99,
        genre: 'Action-adventure',
        description: 'Peter and Miles face Venom.',
        console_id: ps5?.id,
    },
    {
        title: 'Starfield',
        developer: 'Bethesda Game Studios',
        releasedate: new Date('2023-09-06'),
        price: 69.99,
        genre: 'Role-playing',
        description: 'Explore space and create your story.',
        console_id: xbox?.id,
    },
    {
        title: 'Mario Kart 9',
        developer: 'Nintendo EPD',
        releasedate: new Date('2025-12-01'),
        price: 59.99,
        genre: 'Racing',
        description: 'Next-gen Mario Kart.',
        console_id: switch2?.id,
    },
    {
        title: 'Hogwarts Legacy',
        developer: 'Avalanche Software',
        releasedate: new Date('2023-02-10'),
        price: 59.99,
        genre: 'Action role-playing',
        description: 'Wizarding world adventure.',
        console_id: steamDeck?.id,
    },

    {
        title: 'Call of Duty: Modern Warfare III',
        developer: 'Infinity Ward',
        releasedate: new Date('2023-11-10'),
        price: 69.99,
        genre: 'First-person shooter',
        description: 'Modern military combat experience.',
        console_id: ps5?.id,
    },
    {
        title: 'EA Sports FC 24',
        developer: 'EA Sports',
        releasedate: new Date('2023-09-29'),
        price: 69.99,
        genre: 'Sports',
        description: 'Realistic football simulation.',
        console_id: xbox?.id,
    },
    {
        title: 'Resident Evil 4 Remake',
        developer: 'Capcom',
        releasedate: new Date('2023-03-24'),
        price: 59.99,
        genre: 'Survival horror',
        description: 'Remake of the iconic horror game.',
        console_id: ps5?.id,
    },
    {
        title: 'Cyberpunk 2077',
        developer: 'CD Projekt Red',
        releasedate: new Date('2020-12-10'),
        price: 49.99,
        genre: 'Role-playing',
        description: 'Futuristic open-world RPG.',
        console_id: steamDeck?.id,
    },
    {
        title: 'Red Dead Redemption 2',
        developer: 'Rockstar Games',
        releasedate: new Date('2018-10-26'),
        price: 39.99,
        genre: 'Action-adventure',
        description: 'Wild west open-world story.',
        console_id: xbox?.id,
    },
    {
        title: 'The Witcher 3: Wild Hunt',
        developer: 'CD Projekt Red',
        releasedate: new Date('2015-05-19'),
        price: 29.99,
        genre: 'Role-playing',
        description: 'Epic fantasy RPG adventure.',
        console_id: ps5?.id,
    },
    {
        title: 'Assassin’s Creed Valhalla',
        developer: 'Ubisoft',
        releasedate: new Date('2020-11-10'),
        price: 49.99,
        genre: 'Action role-playing',
        description: 'Viking saga in England.',
        console_id: xbox?.id,
    },
    {
        title: 'Battlefield 2042',
        developer: 'DICE',
        releasedate: new Date('2021-11-19'),
        price: 39.99,
        genre: 'First-person shooter',
        description: 'Massive futuristic warfare.',
        console_id: ps5?.id,
    },
    {
        title: 'Minecraft',
        developer: 'Mojang',
        releasedate: new Date('2011-11-18'),
        price: 26.99,
        genre: 'Sandbox',
        description: 'Build and explore infinite worlds.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Fortnite',
        developer: 'Epic Games',
        releasedate: new Date('2017-07-21'),
        price: 0.00,
        genre: 'Battle Royale',
        description: 'Popular online survival shooter.',
        console_id: xbox?.id,
    },

    // restantes hasta 50
    {
        title: 'Dark Souls III',
        developer: 'FromSoftware',
        releasedate: new Date('2016-03-24'),
        price: 39.99,
        genre: 'Action RPG',
        description: 'Challenging dark fantasy combat.',
        console_id: ps5?.id,
    },
    {
        title: 'Sekiro: Shadows Die Twice',
        developer: 'FromSoftware',
        releasedate: new Date('2019-03-22'),
        price: 59.99,
        genre: 'Action-adventure',
        description: 'Samurai stealth and combat.',
        console_id: ps5?.id,
    },
    {
        title: 'DOOM Eternal',
        developer: 'id Software',
        releasedate: new Date('2020-03-20'),
        price: 39.99,
        genre: 'FPS',
        description: 'Fast-paced demon-slaying action.',
        console_id: xbox?.id,
    },
    {
        title: 'Overwatch 2',
        developer: 'Blizzard',
        releasedate: new Date('2022-10-04'),
        price: 0.00,
        genre: 'Shooter',
        description: 'Team-based hero shooter.',
        console_id: xbox?.id,
    },
    {
        title: 'Diablo IV',
        developer: 'Blizzard',
        releasedate: new Date('2023-06-06'),
        price: 69.99,
        genre: 'Action RPG',
        description: 'Dark dungeon crawling adventure.',
        console_id: ps5?.id,
    },
    {
        title: 'Gran Turismo 7',
        developer: 'Polyphony Digital',
        releasedate: new Date('2022-03-04'),
        price: 69.99,
        genre: 'Racing',
        description: 'Realistic driving simulator.',
        console_id: ps5?.id,
    },
    {
        title: 'Ghost of Tsushima',
        developer: 'Sucker Punch',
        releasedate: new Date('2020-07-17'),
        price: 49.99,
        genre: 'Action-adventure',
        description: 'Samurai open-world journey.',
        console_id: ps5?.id,
    },
    {
        title: 'Death Stranding',
        developer: 'Kojima Productions',
        releasedate: new Date('2019-11-08'),
        price: 39.99,
        genre: 'Adventure',
        description: 'Unique delivery-based gameplay.',
        console_id: ps5?.id,
    },
    {
        title: 'Control',
        developer: 'Remedy Entertainment',
        releasedate: new Date('2019-08-27'),
        price: 39.99,
        genre: 'Action',
        description: 'Supernatural action experience.',
        console_id: steamDeck?.id,
    },
    {
        title: 'Hades',
        developer: 'Supergiant Games',
        releasedate: new Date('2020-09-17'),
        price: 24.99,
        genre: 'Roguelike',
        description: 'Fast-paced mythological combat.',
        console_id: steamDeck?.id,
    },

    {
        title: 'Dead Cells',
        developer: 'Motion Twin',
        releasedate: new Date('2018-08-07'),
        price: 24.99,
        genre: 'Roguelike',
        description: 'Action-platformer roguelike.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Cuphead',
        developer: 'Studio MDHR',
        releasedate: new Date('2017-09-29'),
        price: 19.99,
        genre: 'Platformer',
        description: 'Classic cartoon-style boss battles.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Celeste',
        developer: 'Matt Makes Games',
        releasedate: new Date('2018-01-25'),
        price: 19.99,
        genre: 'Platformer',
        description: 'Precision platforming challenge.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Stardew Valley',
        developer: 'ConcernedApe',
        releasedate: new Date('2016-02-26'),
        price: 14.99,
        genre: 'Simulation',
        description: 'Relaxing farming simulator.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Terraria',
        developer: 'Re-Logic',
        releasedate: new Date('2011-05-16'),
        price: 9.99,
        genre: 'Sandbox',
        description: '2D exploration and crafting.',
        console_id: switchOLED?.id,
    },
    {
        title: 'No Man’s Sky',
        developer: 'Hello Games',
        releasedate: new Date('2016-08-09'),
        price: 39.99,
        genre: 'Exploration',
        description: 'Procedural universe exploration.',
        console_id: steamDeck?.id,
    },
    {
        title: 'Final Fantasy VII Remake',
        developer: 'Square Enix',
        releasedate: new Date('2020-04-10'),
        price: 59.99,
        genre: 'RPG',
        description: 'Modern remake of classic RPG.',
        console_id: ps5?.id,
    },
    {
        title: 'Monster Hunter World',
        developer: 'Capcom',
        releasedate: new Date('2018-01-26'),
        price: 29.99,
        genre: 'Action RPG',
        description: 'Hunt massive monsters.',
        console_id: xbox?.id,
    },
    {
        title: 'Among Us',
        developer: 'InnerSloth',
        releasedate: new Date('2018-06-15'),
        price: 4.99,
        genre: 'Party',
        description: 'Social deduction game.',
        console_id: switchOLED?.id,
    },
    {
        title: 'Fall Guys',
        developer: 'Mediatonic',
        releasedate: new Date('2020-08-04'),
        price: 0.00,
        genre: 'Party',
        description: 'Chaotic multiplayer fun.',
        console_id: switchOLED?.id,
    }
];

    for (const game of gamesData) {
        if (!game.console_id) continue

        await prisma.game.create({
            data: game,
        })
    }

    console.log('🕹️ 50 games seeded')

    console.log('✅ Seed completed successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })