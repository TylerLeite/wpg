<script>
import { useTurnStore } from '@/stores/turn';
import { useStatesStore } from '@/stores/states';
import { useResourceStore } from '@/stores/resources';
import { useResearchStore } from '@/stores/research';

export default {
  setup() {
    return {
      states: useStatesStore(),
      turn: useTurnStore(),
      resources: useResourceStore(),
      research: useResearchStore(),
    }
  },

  methods: {
    nextTurn() {
      this.turn.nextTurn();
      this.states.updateTurn(this.turn.turnNumber);

      this.$router.push('/research');
    },

    previewCost() {
      let cost = 0
      for (const key in this.$refs) {
        const value = Number(this.$refs[key].value);
        cost += value;
      }

      this.resources.previewCost = cost;
    },

    confirmPurchase() {
      for (const key in this.$refs) {
        const value = Number(this.$refs[key].value);
        this.resources.currency.logs -= value;
        this.resources.nextTurn.logs -= value;
        this.resources.buildings[key] += value;
        this.$refs[key].value = '';
      }
    },

    setPlacement(at, amt) {
      if (at === 'woodcutters') {
        at = 'forest';
      }

      this.resources.placements[at] = Number(amt);
    },
  },
}
</script>


<template>
  <div class="page" id="city">
    <div class="flex-col phases">
      <span class="phase">
        Logs Available: {{resources.currency.logs - this.resources.previewCost}}
      </span>

      <hr />

      <span class="resource title">Next Turn Resources</span>
      <span class="resource flex-row">
        <span class="flex-col">
          <span class="amount">{{resources.nextTurn.food}}</span>
          <span class="amount">{{resources.nextTurn.gold}}</span>
          <span class="amount">{{resources.nextTurn.logs}}</span>
          <span class="amount">{{resources.nextTurn.piety}}</span>
          <span class="amount">{{resources.nextTurn.villagers}}</span>
        </span>

        <span class="flex-col">
          <span>[f]ood</span>
          <span>[g]old</span>
          <span>[L]ogs</span>
          <span>[p]iety</span>
          <span>[v]illagers</span>
        </span>
      </span>
    </div>

    <div id="map" class="flex-col">
      <div class="flex-row buildings">
        <span v-if="research.ii['Barracks'] !== null" class="flex-col building">
          <img src="@/assets/barracks.png" />
          <input ref="barracks" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span v-if="research.ii['Chapel'] !== null" class="flex-col building">
          <img src="@/assets/chapel.png" />
          <input ref="chapels" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span class="flex-col building">
          <img src="@/assets/farm.png" />
          <input ref="farms" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span v-if="research.iii['Job Market'] !== null" class="flex-col building">
          <img src="@/assets/jobmarket.png" />
          <input ref="job markets" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span class="flex-col building">
          <img src="@/assets/mine.png" />
          <input ref="mines" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span v-if="research.ii['Oracle'] !== null" class="flex-col building">
          <img src="@/assets/oracle.png" />
          <input ref="oracles" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span v-if="research.iv['Real Estate Agency'] !== null" class="flex-col building">
          <img src="@/assets/realestate.png" />
          <input ref="real estate" type="text" placeholder="0" @change="previewCost" />
        </span>

        <span v-if="research.iii['Mana Sauna'] !== null" class="flex-col building">
          <img src="@/assets/sauna.png" />
          <input ref="saunas" type="text" placeholder="0" @change="previewCost" />
        </span>
      </div>

      <button @click="confirmPurchase">Purchase</button>
    </div>

    <div class="flex-col phases">
      <span class="resource">
        <span class="input">{{resources.totalPlaced}}</span>
        <span> / {{resources.villagers}} placed</span>
      </span>
    
      <span 
        v-for="building of Object.keys(resources.placements)"
        class="resource"
      >
        <template v-if="!!resources.buildings[building]">
          <input type="text" :placeholder="resources.placements[building]" @change="setPlacement(building, $event.target.value)" />
          <span> / {{resources.buildings[building]}} {{building}}</span>
        </template>
      </span>

      <span class="resource">
        <input type="text" :placeholder="resources.placements.school" @change="setPlacement('school', $event.target.value)" />
        <span> / {{research.i['School']+1}} school</span>
      </span>

      <span v-if="research.institutions >= 2" class="resource">
        <input type="text" :placeholder="resources.placements.college" @change="setPlacement('college', $event.target.value)" />
        <span> / {{research.i['School']+1}} college</span>
      </span>

      <span v-if="research.institutions >= 3" class="resource">
        <input type="text" :placeholder="resources.placements.university" @change="setPlacement('university', $event.target.value)" />
        <span> / {{research.i['School']+1}} university</span>
      </span>

      <span class="resource">
        <input type="text" :placeholder="resources.placements.forest" @change="setPlacement('woodcutters', $event.target.value)" />
        <span> / {{resources.villagers}} woodcutters</span>
      </span>

      <span 
        :class="`phase warning`"
        @click="nextTurn"
      >
        End Turn
      </span>
    </div>
  </div>
</template>

<style>
#city {
  margin-top: 10px;
  flex-flow: row nowrap;
  align-items: stretch;
}

#map {
  flex-basis: 792px;
  max-width: 792px;

  flex-wrap: wrap;
}

.buildings {
  max-width: 100%;
  flex-wrap: wrap;
}

.building {
  border-radius: 10%;
  width: 178px;
  height: 210.5px;
  padding: 5px;
  margin: 10px;

  justify-content: space-between;
}

.building input {
  border: 1px solid var(--gray);
  font-size: 20px;
  margin-top: 10px;
  width: 100%;
}

.phases {
  width: calc(45vw - 396px);
}

.phase {
  font-size: 24px;
  cursor: pointer;
  margin: 0 10px;
}

.phases hr {
  border-top: 1px solid var(--gray);
  width: 90%;
  margin-top: 10px;
}

.resource.title {
  margin-top: 10px;
  color: var(--green);
}
.resource {
  font-size: 20px;
}
.resource input, .input {
  font-size: 20px;
  text-align: right;
  max-width: 100px;
  min-width: 100px;
  display: inline-block;
}

.resource .amount {
  text-align: right;
}

.phase.active {
  color: var(--green);
}

.phase.active:before {
  content: '>';
}

.phase.inactive {
  color: var(--blue);
}

.phase.disabled {
  color: var(--gray);
}

.phase.warning {
  color: var(--red);
  margin-top: 20px;
  margin-left: 120px;
}

</style>
