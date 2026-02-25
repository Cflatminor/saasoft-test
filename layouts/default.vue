<template>
  <UApp>
    <div class="layout layout--default">
      <slot />

      <footer class="p-4 d-flex justify-center">
        Тестовое по фронтенду 2026 (Nuxt, pinia, tailwind);
      </footer>
    </div>
  </UApp>
</template>

<style scoped>
.layout--default {
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
}

footer {
  margin-top: auto;
}
</style>