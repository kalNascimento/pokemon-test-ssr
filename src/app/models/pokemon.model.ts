interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

interface Form {
  name: string;
  url: string;
}

interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

interface HeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: [
    {
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }
  ];
}

interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: [
    {
      level_learned_at: number;
      version_group: {
        name: string;
        url: string;
      };
      move_learn_method: {
        name: string;
        url: string;
      };
    }
  ];
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface Version {
  generation: {
    name: string;
    url: string;
  };
  types: [
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }
  ];
}

interface Sprite {
  back_default: string;
  back_female: string | null;
  back_shiny: string;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
    home: {
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
    official_artwork: {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string | null;
      back_shiny: string;
      back_shiny_female: string | null;
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
  };
  versions: {
    [generation: string]: {
      [version: string]: {
        back_default: string;
        back_shiny: string;
        front_default: string;
        front_shiny: string;
      };
    };
  };
}

interface Cry {
  latest: string;
  legacy: string;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: Ability[];
  forms: Form[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: Move[];
  species: {
    name: string;
    url: string;
  };
  sprites: Sprite;
  cries: Cry;
  stats: Stat[];
  types: Type[];
  past_types: Version[];
}
