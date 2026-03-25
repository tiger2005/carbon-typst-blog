const THEME_STORAGE_KEY = 'typ-blog-theme';
const THEMES = ['gray-10', 'gray-90', 'gray-100', 'white'];

const getStoredTheme = () => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value && THEMES.includes(value)) {
      return value;
    }
  } catch {
  }

  return null;
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
  }
};

const runWithoutThemeTransition = (callback) => {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  callback();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });
  });
};

const applyTheme = (theme) => {
  runWithoutThemeTransition(() => {
    document.documentElement.setAttribute('data-theme', theme);
  });
  saveTheme(theme);
};

const getInitialTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'gray-90' : 'gray-10';
};

const installThemeSwitch = () => {
  const themeSwitch = document.querySelector('.nav-theme-switch');
  if (!themeSwitch) {
    return;
  }

  applyTheme(getInitialTheme());

  themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getInitialTheme();
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex]);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  installThemeSwitch();
});
