<template>
  <div class="header-navigation border-b border-gray-200 dark:border-gray-800">
    <NuxtLink to="/">
      <Logo />
    </NuxtLink>

    <ULink to="/">
        Se déconnecter
    </ULink>
  </div>
</template>

<style lang="scss" scoped>
.header-navigation {
  position: sticky;
  margin-bottom: 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;

  padding: 0 1rem;
}
</style>
