const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio",
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills",
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash",
    name: "Archive",
    icon: "trash.png",
    canOpen: true,
  },
];


const techStack = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Three.js"],
  },
  {
    category: "Backend & Database",
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Supabase", "Appwrite"],
  },
  {
    category: "AI & ML",
    items: ["Python", "PyTorch", "scikit-learn", "LangChain"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/Madhav-000-s",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/madhavendranath-s/"
  }
];



export const CONTACT_EMAIL = "madhavendranaths@gmail.com"
export const GITHUB_USERNAME = "Madhav-000-s"

// Add repo names here to feature them in Projects (alongside pinned repos)
// Use exact names as they appear in your GitHub URLs
export const FEATURED_PROJECTS: string[] = [
  "portfolio",
  "Parallel-water-quality-monitoring-system",
  "Optimization-in-ML",
  "Movie_app",
  "CNN-BiLSTM-SMS_Spam_Slassification-Model",
]

export {
  navLinks,
  navIcons,
  dockApps,
  techStack,
  socials,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Projects",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [],
}

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "ABOUT_ME.md",
      icon: "/icons/file.svg",
      kind: "file",
      fileType: "readme",
      repoName: "Madhav-000-s", // Profile repo (same as username)
    },
  ],
}

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
    },
  ],
}

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Archive",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [],
}

const GAMES_LOCATION = {
  id: 5,
  type: "games",
  name: "Games",
  icon: "/icons/games.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Snake",
      icon: "/icons/snake.svg",
      kind: "file",
      fileType: "game",
      gameType: "snake",
    },
    {
      id: 2,
      name: "2048",
      icon: "/icons/puzzle.svg",
      kind: "file",
      fileType: "game",
      gameType: "game2048",
    },
    {
      id: 3,
      name: "Memory",
      icon: "/icons/cards.svg",
      kind: "file",
      fileType: "game",
      gameType: "memory",
    },
    {
      id: 4,
      name: "Tic-Tac-Toe",
      icon: "/icons/tictactoe.svg",
      kind: "file",
      fileType: "game",
      gameType: "tictactoe",
    },
  ],
}

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
  games: GAMES_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  snake: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  game2048: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  memory: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  tictactoe: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };