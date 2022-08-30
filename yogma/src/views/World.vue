<script>
import { useTurnStore } from '@/stores/turn';
import { useStatesStore } from '@/stores/states';
import { useResourceStore } from '@/stores/resources';
import { useResearchStore } from '@/stores/research';
import router from '../router';

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
    nextPhase() {
      this.states.nextPhase();
      if (this.states.currentPhase >= 3) {
        this.resources.clearPlacements();
        this.$router.push('/city');
      }
    },

    tileToClass(tile) {
      if (tile == '.') {
        return 'city center empty';
      } else if (tile == 'G') {
        return 'city center ally';
      } else if (tile == 'R') {
        return 'city center enemy';
      } else if (tile == 'S') {
        return 'city center self';
      } else if (tile == '1' || tile == '2') {
        return 'city center unknown';
      } else if (tile == ' ') {
        return 'road empty';
      } else if (tile == '-' || tile == '|') {
        return 'road';
      }
    },

    onClick(id) {
      let arr;

      this.states.deplete(id);
      
      if (this.states.currentPhase == 0) {
        arr = this.states.trades[id];
      } else if (this.states.currentPhase == 1) {
        arr = this.states.negotiations[id];
        this.states.negotiateWith(id);
      } else if (this.states.currentPhase == 2) {
        arr = this.states.invasions[id];

        // Do combat!
        const cp = this.resources.combatPower;
        const enemyCp = arr[0].split(' ')[1];
        let difficulty = (enemyCp - 0.75*cp)/(0.5*cp);

        let victory = difficulty < 0.5;
        if (!victory) {
          difficulty = difficulty*2 - 1;
          victory = Math.random() > difficulty;
        }

        if (!victory) {
          alert('wuh oh!')
          const losses = difficulty / 2;

          let amount = -Math.floor(this.resources.currency.food*losses);
          this.resources.currency.food += amount;
          this.resources.nextTurn.food += amount;

          amount = -Math.floor(this.resources.currency.gold*losses);
          this.resources.currency.gold += amount;
          this.resources.nextTurn.gold += amount;

          amount = -Math.floor(this.resources.currency.logs*losses);
          this.resources.currency.logs += amount;
          this.resources.nextTurn.logs += amount;

          amount = -Math.floor(this.resources.currency.piety*losses);
          this.resources.currency.piety += amount;
          this.resources.nextTurn.piety += amount;

          amount = -Math.floor(this.resources.villagers*losses);
          this.resources.villagers += amount;
          this.resources.nextTurn.villagers += amount;
        }

        this.states.invade(id, victory);
      }

      if (typeof arr === 'undefined') {
        arr = [];
      }

      for (const line of arr) {
        this.resources.update(line);
      }
    },

    difficulty(myCp, theirCp) {
      const hue = 160*(theirCp - 0.75*myCp)/(0.5*myCp);
      return `hsl(${160-hue}, 100%, 37%)`;
    }
  },
}
</script>


<template>
  <div class="page" id="world">
    <div class="flex-col phases">
      <span :class="`phase ${states.currentPhase == 0 ? 'active' : 'disabled'}`">
        Trade
      </span>
      <span :class="`phase ${states.currentPhase == 1 ? 'active' : states.currentPhase == 0 ? 'inactive' : 'disabled'}`">
        Negotiation
      </span>
      <span :class="`phase ${states.currentPhase == 2 ? 'active' : 'inactive'}`">
        Invasion
      </span>
      <span class="phase warning" @click="nextPhase">
        Next Phase
      </span>

      <hr />

      <span class="resource title">Available Resources</span>
      <span class="resource flex-row">
        <span class="flex-col">
          <span class="amount">{{resources.currency.food}}</span>
          <span class="amount">{{resources.currency.gold}}</span>
          <span class="amount">{{resources.currency.logs}}</span>
          <span class="amount">{{resources.currency.piety}}</span>
          <span class="amount">{{resources.villagers}}</span>
        </span>

        <span class="flex-col">
          <span>[f]ood</span>
          <span>[g]old</span>
          <span>[L]ogs</span>
          <span>[p]iety</span>
          <span>[v]illagers</span>
        </span>
      </span>

      <span class="resource title">Military Resources</span>
      <span class="resource flex-row">
        <span class="flex-col">
          <span class="amount">{{resources.placements.barracks}}</span>

          <template v-if="research.iii['Combat Magic'] !== null">
            <span class="amount">{{resources.placements.oracles}}</span>
          </template>

          <span class="amount">lv. {{research.iii["Walls"]+1}}</span>

          <template v-if="typeof research.iv['Artillery'] !== 'undefined'">
            <span class="amount">lv. {{research.iv["Artillery"]+1}}</span>
          </template>

        </span>

        <span class="flex-col">
          <span>&nbsp;soldiers, CR {{research.ii["Barracks"]}}</span>

          <template v-if="research.iii['Combat Magic'] !== null">
            <span class="amount">&nbsp;wizards, CR {{research.iii["Combat Magic"]}}</span>
          </template>

          <template v-if="research.iv['Spiked Walls']">
            <span>&nbsp;spiked walls</span>
          </template><template v-else>
            <span>&nbsp;walls</span>
          </template>

          <template v-if="typeof research.iv['Artillery'] !== 'undefined'">
            <span>&nbsp;artillery</span>
          </template>
        </span>
      </span>
    </div>

    <div class="flex-col center">
      <div 
        v-for="(row, y) in states.grid" 
        class="flex-row center grid-row"
      >
        <span 
          v-for="(tile, x) in row"
          :class="`flex-col ${tileToClass(tile)} ${states.connectedToSelf(x, y) && (tile == 'G' || tile == 'S' || tile == 'R') ? 'connected' : 'disconnected'}`"
        >
          <span 
            v-if="x%2 == 0 && y%2 == 0"
            :class="`text-wrapper ${!!states.depleted[y*states.grid[0].length+x] || (tile != 'G' && tile != 'R') ? 'depleted' : ''}`"
            @click="onClick(y*states.grid[0].length+x)"
          >
            <template v-if="states.currentPhase == 0">
              <p v-for="trade in states.trades[y*states.grid[0].length+x]">{{trade}}</p>
            </template>

            <template v-if="states.currentPhase == 1">
              <p v-for="negotiation in states.negotiations[y*states.grid[0].length+x]">{{negotiation}}</p>
            </template>

            <template v-if="states.currentPhase == 2">
              <p v-for="(invasion, idx) in states.invasions[y*states.grid[0].length+x]">
                <span v-if="idx == 0" :style="{color: difficulty(resources.combatPower, Number(invasion.split(' ')[1]))}">{{invasion}}</span>
                <span v-else>{{invasion}}</span>
              </p>
            </template>
          </span>
        </span>
      </div>
    </div>

    <div class="flex-col phases next-turn">
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
  </div>
</template>

<style>
#world {
  margin-top: 10px;
  flex-flow: row nowrap;
  align-items: stretch;
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
}

.grid-row:nth-child(2n) > .road:nth-child(2n+1) {
  margin: 0 38px;
}
.city {
  width: 96px;
  height: 96px;
}
.city.disconnected {
  opacity: 0.2;
}

.city.disconnected .text-wrapper {
  display: none;
}

.depleted {
  display: none;
}

.city .text-wrapper {
  background: var(--white);
  border-radius: 4px;

  width: 86px;
  height: 86px;

  padding: 5px;

  cursor: pointer;
}

.city .get {
  color: var(--green);
}

.city .give {
  color: var(--red);
}

.road {
  width: 20px;
  height: 20px;

  background: black;
}

.empty {
  background: transparent ! important;
}

.ally {
  background: var(--green);
}
.enemy {
  background: var(--red);
}
.self {
  background: var(--blue);
}
.unknown {
  background: var(--gray);
}

.next-turn {
  align-items: flex-end;
}

</style>
