import { defineStore } from 'pinia'

import { useResearchStore } from '@/stores/research'

export const useResourceStore = defineStore({
  id: 'resources',
  state: () => ({
    currency: {
      food: 0,
      gold: 0,
      logs: 0,
      piety: 0,
    },

    nextTurn: {
      food: 0,
      gold: 0,
      logs: 0,
      piety: 0,
      villagers: 12,
    },

    villagers: 12,

    previewCost: 0,

    // TODO: match research names?
    buildings: {
      barracks: 0,
      chapels: 0,
      farms: 8,
      "job markets": 0,
      mines: 4,
      oracles: 0,
      "real estate": 0,
      saunas: 0,
    },

    placements: {
      barracks: 0,
      chapels: 0,
      college: 0,
      farms: 0,
      forest: 0,
      "job markets": 0,
      mines: 0,
      oracles: 0,
      "real estate": 0,
      saunas: 0,
      school: 0,
      university: 0,
    },
  }),

  getters: {
    combatPower() {
      const research = useResearchStore();

      let cp = this.resources.villagers/10;

      cp += this.placements.barracks*Math.pow(2, research.ii["Barracks"]);
      if (research.iii["Combat Magic"] !== null) {
        cp += 1.5*this.placements.oracles*Math.pow(2, research.iii["Combat Magic"]);
      }

      const wallCp = 5*research.iii["Walls"];
      if (research.iv['Spiked Walls']) {
        cp += 2*wallCp;
      } else {
        cp += wallCp;
      }

      if (typeof research.iv['Artillery'] !== "undefined") {
        cp += 50*research.iv['Artillery']*research.iv['Artillery'];
      }

      return cp;
    },

    totalPlaced() {
      let total = 0;
      for (let place in this.placements) {
        total += this.placements[place];
      }
      return total;
    },
  },

  actions: {
    harvest() {
      this.currency.food = this.nextTurn.food;
      this.currency.gold = this.nextTurn.gold;
      this.currency.logs = this.nextTurn.logs;
      this.currency.piety = this.nextTurn.piety;
      this.villagers = this.nextTurn.villagers;

      const research = useResearchStore();

      this.currency.food += this.placements.farms * Math.max(1, research.i["Farming"] * 4);
      this.currency.gold += this.placements.mines * Math.pow(2, research.i["Mining"]);
      this.currency.logs += this.placements.forest;
      this.currency.piety += this.placements.chapels * Math.pow(4, research.ii["Chapel"]-1);

      this.currency.food -= this.villagers*2;
      if (this.currency.food < 0) {
        this.villagers -= Math.floor(-this.currency.food/2);
        this.currency.food = 0;
      }

      this.nextTurn.food = this.currency.food;
      this.nextTurn.gold = this.currency.gold;
      this.nextTurn.logs = this.currency.logs;
      this.nextTurn.piety = this.currency.piety;
      this.nextTurn.villagers = this.villagers;
    },

    clearPlacements () {
      for (const key in this.placements) {
        this.placements[key] = 0;
      }
    },

    update(line) {
      if (line[0] !== '-' && line[0] !== '+') {
        return;
      }

      const resource = line[line.length-1];
      const amount = Number(line.slice(0, line.length-1));
      let nowAmount = 0;
      if (amount < 0) {
        nowAmount = amount;
      }
      if (resource === 'f') {
        this.nextTurn.food += amount;
        this.currency.food += nowAmount;
      } else if (resource === 'g') {
        this.nextTurn.gold += amount;
        this.currency.gold += nowAmount;
      } else if (resource === 'L') {
        this.nextTurn.logs += amount;
        this.currency.logs += nowAmount;
      } else if (resource === 'p') {
        this.nextTurn.piety += amount;
        this.currency.piety += nowAmount;
      } else if (resource === 'v') {
        this.nextTurn.villagers += amount;
        this.villagers += nowAmount;
      }
    }
  }
})
