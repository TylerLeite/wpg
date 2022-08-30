import { defineStore } from 'pinia';

import { useResourceStore } from '@/stores/resources';

export const useStatesStore = defineStore({
  id: 'states',
  state: () => ({
    grid: [
      ['2', '-', '2', ' ', '.', ' ', '.', ' ', '2', '-', '2', ' ', '.'],
      ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' '],
      ['2', '-', '1', '-', '1', ' ', '.', ' ', '1', ' ', '.', ' ', '2'],
      ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      ['2', ' ', '.', ' ', 'G', '-', 'R', '-', 'G', ' ', '1', '-', '2'],
      [' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', ' '],
      ['.', ' ', '1', ' ', 'G', '-', 'S', '-', 'R', '-', '1', '-', '2'],
      [' ', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' '],
      ['2', ' ', '1', '-', 'R', '-', 'G', ' ', '.', ' ', '1', ' ', '.'],
      ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' '],
      ['2', '-', '1', ' ', '.', ' ', '1', '-', '1', '-', '1', '-', '2'],
      [' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' '],
      ['.', ' ', '2', '-', '2', '-', '2', ' ', '.', ' ', '2', ' ', '.']
    ],

    annexations: 0,
    unions: 0,

    currentPhase: 0,

    trades: {},
    negotiations: {},
    invasions: {},
    depleted: {},
  }),

  getters: {
    at: (state) => (x, y) => state.grid[y][x],

    connected: (state) => (x1, y1, x2, y2) => {
      const nx = (x1 + x2)/2;
      const ny = (y1 + y2)/2;
      return state.grid[ny][nx] != ' '
    },

    connectedToSelf: (state) => (x, y) => {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          const nx = x + 2*dx;
          const ny = y + 2*dy;
          
          if (
            nx < 0 || ny < 0 
            || nx >= state.grid[0].length || ny >= state.grid.length
          ) {
            continue;
          }

          if (state.connected(x, y, nx, ny) && state.at(nx, ny) == 'S') {
            return true;
          }
        }
      }

      return false;
    }
  },

  actions: {
    nextPhase() {
      this.currentPhase += 1;
      this.depleted = {};
    },

    deplete(id) {
      this.depleted[id] = true;
    },

    negotiateWith(id) {
      const x = id % this.grid[0].length;
      const y = Math.floor(id / this.grid.length);

      const tile = this.grid[y][x];
      if (tile === 'G') {
        this.grid[y][x] = 'S';
      } else if (tile === 'R') {
        this.grid[y][x] = 'G';
      }
    },

    invade(id, victory) {
      const x = id % this.grid[0].length;
      const y = Math.floor(id / this.grid.length);

      const tile = this.grid[y][x];
      if (tile === 'G') {
        this.grid[y][x] = 'R';
      } else if (tile === 'R' && victory) {
        this.grid[y][x] = 'S';
      }
    },

    updateTurn(turn) {
      const resources = useResourceStore();

      this.currentPhase = 0;

      // Tile to be replaced when more map is revealed
      let replace = '1';
      if (turn == 10) {
        replace = '2';
      }

      for (let y = 0; y < this.grid.length; y += 2) {
        const row = this.grid[y];
        for (let x = 0; x < row.length; x += 2) {
          const gIdx = y*this.grid[0].length+x;
          const tile = row[x];

          // Update map based on the current turn
          if (turn == 8 || turn == 10) {
            if (tile == replace) {
              const p = this.unions; // positive
              const n = this.annexations; // negative
              if (p == 0 && n == 0) {
                this.grid[y][x] = Math.random() < 0.5 ? 'G' : 'R';
              } else {
                this.grid[y][x] = Math.random() < p/(n+p) ? 'G' : 'R';
              }
            }
          }

          //this.connectedToSelf(x, y) &&
          if (tile === 'G' || tile === 'R') {
            // Set trade offers
            const twoGives = Math.random() < 0.4;
            const twoGets = twoGives ? false : Math.random() < 0.67;
            let trades = [];

            const available = [
              resources.currency.gold,
              resources.currency.food,
              resources.currency.logs,
              resources.currency.piety,
              resources.villagers,
            ];
            const keys = ['g', 'f', 'L', 'p', 'v'];

            for (let i = 4; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [available[i], available[j]] = [available[j], available[i]];
                [keys[i], keys[j]] = [keys[j], keys[i]];
            }

            let giveTotal = 0;

            const give1 = Math.max(1, Math.floor((0.5+Math.random()/2)*available[0]));
            giveTotal += give1;
            trades.push(`-${give1}${keys[0]}`);
            if (twoGives) {
              const give2 = Math.max(1, Math.floor(Math.random()*available[1]));
              giveTotal += give2;
              trades.push(`-${give2}${keys[1]}`);
            }

            const getTotal = tile == 'G' ? Math.floor(giveTotal * 1.2) : Math.floor(giveTotal * 0.8);

            if (twoGets) {
              const get1 = Math.max(1, Math.floor(Math.random()*getTotal));
              const get2 = Math.max(1, getTotal - get1);

              trades.push(`+${get1}${keys[2]}`);
              trades.push(`+${get2}${keys[3]}`);
            } else {
              trades.push(`+${getTotal}${keys[2]}`);
            }

            this.trades[gIdx] = trades;

            // Average available resources
            // const amt = Math.max.apply(null, available);
            const amt = available.reduce((a, b) => a+b)/available.length;

            // Set negotiation requests
            let negotiations = [];
            if (tile == 'G') {
              const g = Math.max(1, Math.floor(amt*(0.4+Math.random()/2)));
              const p = Math.max(1, Math.floor(amt*(0.4+Math.random()/2)));
              const v = Math.max(1, Math.floor(amt*(0.4+Math.random()/2)));

              const r = Math.floor(Math.random()*7);
              if (r != 1 && r != 2 && r != 4) {negotiations.push(`+${g}g`);}
              if (r != 0 && r != 2 && r != 5) {negotiations.push(`+${p}p`);}
              if (r != 0 && r != 1 && r != 3) {negotiations.push(`+${v}v`);}
            } else if (tile == 'R') {
              const g = Math.max(1, Math.floor(resources.currency.gold*(0.25+Math.random()/2)));
              const p = Math.max(1, Math.floor(resources.currency.piety*(0.25+Math.random()/2)));
              const v = Math.max(1, Math.floor(resources.villagers*(0.25+Math.random()/2)));

              const r = Math.floor(Math.random()*6);
              if (r != 1 && r != 2 && r != 4) {negotiations.push(`-${g}g`);}
              if (r != 0 && r != 2 && r != 5) {negotiations.push(`-${p}p`);}
              if (r != 0 && r != 1 && r != 3) {negotiations.push(`-${v}v`);}
            }

            this.negotiations[gIdx] = negotiations;

            // Set armies, plunder
            let invasions = [];

            const difficulty = 0.75 + Math.random()/2;
            const g = Math.max(1, Math.floor(difficulty*amt*(0.25+Math.random()/2)));
            const p = Math.max(1, Math.floor(difficulty*amt*(0.25+Math.random()/2)));
            const v = Math.max(1, Math.floor(difficulty*amt*(0.25+Math.random()/2)));

            const cp = difficulty*resources.combatPower;
            invasions.push(`CP ${Math.floor(cp)}`)

            const r = Math.floor(Math.random()*6);
            if (r != 1 && r != 2 && r != 4) {invasions.push(`+${g}g`);}
            if (r != 0 && r != 2 && r != 5) {invasions.push(`+${p}p`);}
            if (r != 0 && r != 1 && r != 3) {invasions.push(`+${v}v`);}

            this.invasions[gIdx] = invasions;
          }
        }
      }
    }
  }
})
