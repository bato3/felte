<script>
  import Logo from './Logo.svelte';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';

  let prefersDarkScheme = false;
  let matchesPrefersDarkScheme;
  let observer;
  let mqList;

  function mutationCallback(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') continue;
     prefersDarkScheme = mutation.target.classList.contains('dark');
    }
  }

  function setLightMode() {
      prefersDarkScheme = false;
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      if (matchesPrefersDarkScheme) localStorage.setItem('colorScheme', 'light')
      else localStorage.removeItem('colorScheme');
  }

  function setDarkMode() {
      prefersDarkScheme = true;
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      if (!matchesPrefersDarkScheme) localStorage.setItem('colorScheme', 'dark')
      else localStorage.removeItem('colorScheme');
  }

  function watchMedia(e) {
    if (!e.matches) setLightMode();
    else setDarkMode();
  }

  onMount(() => {
    observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { attributes: true });
    const colorScheme = localStorage.getItem('colorScheme');
    mqList = matchMedia('(prefers-color-scheme: dark)')
    matchesPrefersDarkScheme = mqList.matches;
    mqList.addEventListener('change', watchMedia);
    if (colorScheme) prefersDarkScheme = colorScheme === 'dark';
    else prefersDarkScheme = matchesPrefersDarkScheme;
    if (prefersDarkScheme) document.body.classList.add('dark');
    else document.body.classList.add('light');
  });

  onDestroy(() => {
    observer?.disconnect();
    mqList?.removeEventListener('change', watchMedia);
  });

  function toggleDarkMode() {
    if (prefersDarkScheme) setLightMode();
    else setDarkMode();
  }
</script>

<header>
  <nav aria-label="main">
    <h1>
      <a
        href="/"
        aria-current="{$page.url.pathname === '/' ? 'page' : undefined}"
        >
        <span class="sr-only">Felte Home</span>
        <Logo />
      </a>
    </h1>
    <ul>
      <li>
        <a
          aria-current="{$page.url.pathname === '/docs' ? 'page' : undefined}"
          aria-label="Documentation"
          href="/docs"
          sveltekit:prefetch
          >
          docs
        </a>
      </li>
      <li>
        <a
          class=icon-link
          rel="noreferrer external"
          href="https://github.com/pablo-abc/felte"
          >
          <span class="sr-only">Github Repository</span>
          <svg aria-hidden="true" role="img" height="25" width="25" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.975 16a9.39 9.39 0 003.169-.509c-.473.076-.652-.229-.652-.486l.004-.572c.003-.521.01-1.3.01-2.197 0-.944-.316-1.549-.68-1.863 2.24-.252 4.594-1.108 4.594-4.973 0-1.108-.39-2.002-1.032-2.707.1-.251.453-1.284-.1-2.668 0 0-.844-.277-2.77 1.032A9.345 9.345 0 008 .717c-.856 0-1.712.113-2.518.34C3.556-.24 2.712.025 2.712.025c-.553 1.384-.2 2.417-.1 2.668-.642.705-1.033 1.612-1.033 2.707 0 3.852 2.342 4.72 4.583 4.973-.29.252-.554.692-.642 1.347-.58.264-2.027.692-2.933-.831-.19-.302-.756-1.045-1.549-1.032-.843.012-.34.478.013.667.428.239.919 1.133 1.032 1.422.201.567.856 1.65 3.386 1.184 0 .55.006 1.079.01 1.447l.003.428c0 .265-.189.567-.692.479 1.007.34 1.926.516 3.185.516z"></path>
          </svg>
        </a>
      </li>
      <li>
        <button
          on:click={toggleDarkMode}
          class="moon-button"
          aria-pressed={String(prefersDarkScheme)}
          >
          <span class="sr-only">Enable dark mode</span>
          <svg aria-hidden="true" role="img" height="25" width="25" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</header>

<style>
  svg {
    height: 1.5rem;
    width: auto;
  }

  header {
    width: 100%;
    height: var(--header-height);
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    width: 95%;
  }

  h1 {
    margin: 0;
    padding: 0;
    padding-left: 2rem;
  }

  h1 a {
    display: grid;
    place-items: center;
    padding: 0 0.5rem;
  }

  ul {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    padding-right: 2rem;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
  }

  [aria-current]::before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 62, 0);
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  a, button {
    height: var(--header-height);
    transition: background 0.1s;
  }

  .icon-link, .moon-button {
    display: grid;
    place-items: center;
    padding: 0 0.6em;
  }

  a:hover, button:hover {
    color: var(--primary-font-color);
    background: var(--header-background-hover);
  }

</style>
