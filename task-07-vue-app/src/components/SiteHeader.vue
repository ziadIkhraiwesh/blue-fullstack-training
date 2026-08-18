<template>
  <header class="site-header">
    <div class="container header-content">
      <a class="logo" href="#home">NexaTech<span>.</span></a>

      <nav aria-label="Main navigation">
        <ul class="navigation-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#posts">Posts</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  gap: 1.5rem;
}

.logo {
  color: var(--color-primary);
  font-size: 1.35rem;
  font-weight: 900;
  text-decoration: none;
}

.logo span {
  color: var(--color-secondary);
}

.navigation-list {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}

.navigation-list a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

.navigation-list a:hover {
  color: var(--color-secondary);
}

@media (max-width: 480px) {
  .header-content {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
    padding-block: 1rem;
  }

  .navigation-list {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>