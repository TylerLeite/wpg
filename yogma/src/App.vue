<script setup>
import { useTurnStore } from '@/stores/turn';
import { RouterLink, RouterView } from 'vue-router';

const turn = useTurnStore();
</script>

<template>
  <header class="flex-row">
    <a href="/"><img alt="Vue logo" class="logo" src="@/assets/bug.png" width="48" height="48" /></a>

    <nav class="flex-row">
      <span class="calendar">{{turn.turnText}}</span>
      <RouterLink to="/research">Research</RouterLink>
      <RouterLink to="/world">Government</RouterLink>
      <RouterLink to="/city">Placement</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 90vw;
  margin: 0 auto;
  padding: 10px 0;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 48px;
}

a {
  text-decoration: none;
  color: var(--green);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    color: var(--green-alpha);
  }
}

nav {
  width: 100%;
  font-size: 24px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a, nav .calendar {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  max-height: 48px;
}

nav .calendar {
  width: 160px;
}
</style>
