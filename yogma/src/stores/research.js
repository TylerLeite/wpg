import { defineStore } from 'pinia'

export const useResearchStore = defineStore({
  id: 'research',
  state: () => ({
    institutions: 0,

    points: [{
      "Farming": 0,
      "Mining": 0,
      "Logging": 0,
      "Bear Repellent": false,
      "Irrigation": false,
      "Reinforcements": false,
    }, {
      "Oracle": null,
      "Chapel": 0,
      "Lightning Rods": false,
      "N95 Masks": false,
      "Fire Brigade": false,
    }, {
      "Mana Sauna": null,
      "Job Market": null,
      "War Strats": false,
      "Combat Magic": null,
      // Commodoties
    }, {
      "Real Estate Agency": null,
      "Spiked Walls": false,
      "Sell Buildings": false,
      // Merchant class
    }],
  }),

  getters: {
    i: (state) => state.points[0],
    ii: (state) => state.points[1],
    iii: (state) => state.points[2],
    iv: (state) => state.points[3],

    school: (state) => state.institutions > 0,
    college: (state) => state.institutions > 1,
    university: (state) => state.institutions > 2,
  },

  actions: {
    research(tier, key) {
      // TODO: check key in tier
      if (this.points[tier][key] === false) {
        this.points[tier][key] = true;
      } else if (this[tier][key] === null) {
        this.points[tier][key] = 1;
      } else if (this[tier][key] < 3) {
        this.points[tier][key] += 1;
      } else {
        console.error("Could not research", key, "with state:", this);
      }
    },

    updateTurn(turn) {
      if (turn == 1) {
        this[0]["School"] = 0;
        this["institutions"] = 1;
      } else if (turn == 2) {
        this[1]["Barracks"] = 0;
      } else if (turn == 4) {
        this["institutions"] = 2;
      } else if (turn == 5) {
        this[2]["Walls"] = 0;
      } else if (turn == 8) {
        this["institutions"] = 3;
      } else if (turn == 9) {
        this[3]["Artillery"] = 0;
      }
    }
  }
})
