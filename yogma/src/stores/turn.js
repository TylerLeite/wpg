import { defineStore } from 'pinia'

import { useResearchStore } from '@/stores/research';
import { useResourceStore } from '@/stores/resources';
import { useStatesStore } from '@/stores/states';


const seasons = ["Spring", "Summer", "Fall", "Winter"]

export const useTurnStore = defineStore({
  id: 'turn',
  state: () => ({
    season: 1,
    month: 2,
  }),
  getters: {
    turnText: (state) => `${seasons[state.season]} ${state.month + 1}`,
    turnNumber: (state) => state.season*3 + state.month,
  },
  actions: {
    nextTurn() {
      this.month += 1;

      if (this.month > 2) {
        this.month = 0;
        this.season += 1;
      }

      // propagate turn update
      const research = useResearchStore();
      const resources = useResourceStore();
      const states = useStatesStore();

      research.updateTurn(this.turnNumber);
      resources.harvest();
      states.updateTurn(this.turnNumber);
    },
  }
})
