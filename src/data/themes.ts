export const themesData = {
  Space: {
    name: "Space",
    description: "Explore planets, stars, and rockets!",
    icon: "🚀",
    color: "blue",
    safeWords: [
      "planets", "stars", "rocket", "astronaut", "moon", "sun", "galaxy", 
      "spaceship", "alien friend", "comet", "constellation", "orbit", 
      "telescope", "space station", "meteor", "nebula", "solar system"
    ],
    characters: ["Luna the astronaut", "Zara the space explorer", "Cosmo the friendly alien"]
  },
  Forest: {
    name: "Forest",
    description: "Meet animals, trees, and flowers!",
    icon: "🌲",
    color: "green",
    safeWords: [
      "trees", "animals", "flowers", "birds", "rabbit", "squirrel", "deer",
      "butterfly", "stream", "meadow", "acorn", "nest", "leaves", "berries",
      "mushroom", "owl", "fox", "woodland", "nature", "trail"
    ],
    characters: ["Finn the forest guide", "Hazel the wise owl", "Berry the friendly bear"]
  }
} as const

export type ThemeName = keyof typeof themesData