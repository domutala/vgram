import { readonly, ref } from 'vue';

export type AppTheme = 'light' | 'dark';

const theme = ref<AppTheme>('dark');
let initialized = false;

function applyTheme(value: AppTheme) {
  if (typeof document === 'undefined') return;

  document.documentElement.classList.toggle('dark', value === 'dark');
  document.documentElement.style.colorScheme = value;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      'content',
      value === 'dark' ? 'oklch(14.5% 0 0)' : '#f8f7f4',
    );
}

export function useTheme() {
  function initializeTheme() {
    if (initialized || typeof window === 'undefined') return;

    const storedTheme = window.localStorage.getItem('movie:theme');
    theme.value = storedTheme === 'light' ? 'light' : 'dark';
    applyTheme(theme.value);
    initialized = true;
  }

  function setTheme(value: AppTheme) {
    theme.value = value;
    applyTheme(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('movie:theme', value);
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  }

  return {
    theme: readonly(theme),
    initializeTheme,
    setTheme,
    toggleTheme,
  };
}
