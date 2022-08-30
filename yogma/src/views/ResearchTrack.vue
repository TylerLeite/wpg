<script>
import { useResearchStore } from '@/stores/research'
import { useResourceStore } from '@/stores/resources'
import { useStatesStore } from '@/stores/states'

export default {
  setup() {
    return {
      research: useResearchStore(),
      resources: useResourceStore(),
      states: useStatesStore(),
    }
  },

  methods: {
    updateResearchState() {
      for (let i = 0; i < 4; i++) {
        for (const key in this.research.points[i]) {
          if (typeof this.$refs[key] === "undefined") {continue;}
          const children = this.$refs[key][0].children;
          for (const child of children) {
            if (!child.disabled && child.checked) {
              console.log(this.research);
              this.research.research(i, key);
            }
          }
        }
      }

      // TODO: Separate this out

      // Collect resources with new research
      this.resources.harvest();

      // Update turn in the government page (with newly harvested resources)
      this.states.updateTurn(this.turnNumber);

      this.$router.push('/world');
    }
  },
}
</script>

<template>
  <div class="page" id="research-track">
    <span class="flex-row points">
      <h2>Points available -&nbsp;</h2>
      <h2 v-if="research.school">Level 1: <span class="green">{{resources.placements.school}}</span> &nbsp;</h2>
      <h2 v-if="research.college">Level 2: <span class="green">{{resources.placements.college}}</span> &nbsp;</h2>
      <h2 v-if="research.university">Level 3: <span class="green">{{resources.placements.university}}</span></h2>
    </span>

    <div v-for="key in Object.keys(research.i)" class="flex-row item">
      <span class="key">{{key}}</span>
      <span class="flex-row levels" :ref="key">
        <template v-if="!!research.i[key] === research.i[key]">
          <input 
            type="checkbox" 
            :disabled="research.i[key] === true" 
            :checked ="research.i[key] === true" 
            class="radio"
          />
        </template>

        <template v-else><template v-for="n in 3">
          <input v-if="research.institutions >= n" 
            type="checkbox" 
            :disabled="research.i[key] >= n || research.i[key] < n-1"
            :checked ="research.i[key] >= n"
          />
        </template></template>
      </span>
    </div>

    <hr /><span></span>

    <template v-if="research[0]['Logging'] >= 2" class="flex-col">
      <div v-for="key in Object.keys(research.ii)" class="flex-row item">
        <span class="key">{{key}}</span>
        <span class="flex-row levels" :ref="key">
          <template v-if="!!research.ii[key] === research.ii[key]">
            <input 
              type="checkbox" 
              :disabled="research.ii[key] === true" 
              :checked ="research.ii[key] === true" 
              class="radio"
            />
          </template>

          <template v-else><template v-for="n in 3">
            <input v-if="research.institutions >= n" 
              type="checkbox" 
              :disabled="research.ii[key] >= n || research.ii[key] < n-1"
              :checked ="research.ii[key] >= n"
            />
          </template></template>
        </span>
      </div>
    </template>

    <hr /><span></span>

    <template v-if="research[0]['Logging'] >= 2" class="flex-col">
      <div v-for="key in Object.keys(research.iii)" class="flex-row item">
        <span class="key">{{key}}</span>
        <span class="flex-row levels" :ref="key">
          <template v-if="!!research.iii[key] === research.iii[key]">
            <input 
              type="checkbox" 
              :disabled="research.iii[key] === true" 
              :checked ="research.iii[key] === true" 
              class="radio"
            />
          </template>

          <template v-else><template v-for="n in 3">
            <input v-if="research.institutions >= n" 
              type="checkbox" 
              :disabled="research.iii[key] >= n || research.iii[key] < n-1"
              :checked ="research.iii[key] >= n"
            />
          </template></template>
        </span>
      </div>
    </template>

    <hr /><span></span>

    <template v-if="research[0]['Logging'] >= 3" class="flex-col">
      <div v-for="key in Object.keys(research.iv)" class="flex-row item">
        <span class="key">{{key}}</span>
        <span class="flex-row levels" :ref="key">
          <template v-if="!!research.iv[key] === research.iv[key]">
            <input 
              type="checkbox" 
              :disabled="research.iv[key] === true" 
              :checked ="research.iv[key] === true" 
              class="radio"
            />
          </template>

          <template v-else><template v-for="n in 3">
            <input v-if="research.institutions >= n" 
              type="checkbox" 
              :disabled="research.iv[key] >= n || research.iv[key] < n-1"
              :checked ="research.iv[key] >= n"
            />
          </template></template>
        </span>
      </div>
    </template>

    <button @click="updateResearchState">Send It</button>

  </div>
</template>

<style>
.points {
  margin-bottom: 10px;
}
.green {
  color: var(--green);
}
.item {
  width: 100%;
  justify-content: center;
  font-size: 20px;
}
.item:nth-child(2n) {
  background: var(--green-alpha);
}
.key {
  flex-basis: 250px;
}
.levels {
  flex-basis: 250px;
  padding-right: 100px;
  justify-content: space-between;
}
input {
  width: 20px;
}
input.radio {
  border-radius: 100%;
}

hr {
  background: var(--gray-light) !important;
  height: 2px;
  width: 100%;
}
</style>
