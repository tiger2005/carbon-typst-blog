// 小尺寸设备下的导航切换
const installSidebarSwitch = () => {
  const header = document.querySelector('header');
  const menuSwitch = header?.querySelector('.nav-menu-switch');
  const sidebar = header?.querySelector('.nav-sidebar');
  const backdrop = header?.querySelector('.nav-sidebar-backdrop');

  if (!header || !menuSwitch || !sidebar || !backdrop) {
    return;
  }

  const sidebarLinks = sidebar.querySelectorAll('a[href]');

  const updateSidebarTabOrder = (isOpen) => {
    sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    menuSwitch.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    sidebarLinks.forEach((link) => {
      if (isOpen) {
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('tabindex', '-1');
      }
    });
  };

  const closeSidebar = () => {
    header.classList.remove('nav-menu-open');
    updateSidebarTabOrder(false);
  };

  const toggleSidebar = () => {
    const isOpen = header.classList.toggle('nav-menu-open');
    updateSidebarTabOrder(isOpen);
  };

  updateSidebarTabOrder(header.classList.contains('nav-menu-open'));

  menuSwitch.addEventListener('click', toggleSidebar);
  backdrop.addEventListener('click', closeSidebar);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 769px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      closeSidebar();
    }
  });
};

// 回到顶部按钮
const BACK_TO_TOP_BUTTON_CLASS = 'back-to-top-button';

const getScrollToTopBehavior = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion ? 'auto' : 'smooth';
};

const ensureBackToTopButton = () => {
  const existingButton = document.querySelector(`.${BACK_TO_TOP_BUTTON_CLASS}`);
  if (existingButton) {
    return existingButton;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = BACK_TO_TOP_BUTTON_CLASS;
  button.setAttribute('aria-label', '回到开头');

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: getScrollToTopBehavior(),
    });
  });

  document.body.appendChild(button);
  return button;
};

const setBackToTopButtonVisible = (isVisible) => {
  const button = document.querySelector(`.${BACK_TO_TOP_BUTTON_CLASS}`);
  if (!button) {
    return;
  }

  button.classList.toggle('is-visible', isVisible);
  button.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

  if (isVisible) {
    button.removeAttribute('tabindex');
  } else {
    button.setAttribute('tabindex', '-1');
  }
};

// 文章顶部导航的切换
const TOP_NAV_ORIGINAL_TABINDEX_ATTR = 'data-top-nav-original-tabindex';

const setTopNavButtonsFocusable = (isFocusable) => {
  const topNavLinks = document.querySelectorAll(
    'header .nav-body.has-post-title > .nav-body-upper > .nav-body-upper-links > a',
  );

  topNavLinks.forEach((link) => {
    if (!link.hasAttribute(TOP_NAV_ORIGINAL_TABINDEX_ATTR)) {
      const originalTabIndex = link.getAttribute('tabindex');
      link.setAttribute(TOP_NAV_ORIGINAL_TABINDEX_ATTR, originalTabIndex ?? '');
    }

    if (isFocusable) {
      const originalTabIndex = link.getAttribute(TOP_NAV_ORIGINAL_TABINDEX_ATTR);
      if (originalTabIndex === '') {
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('tabindex', originalTabIndex);
      }

      return;
    }

    link.setAttribute('tabindex', '-1');
  });
};

const updatePostNavCollapsedState = () => {
  const header = document.querySelector('header');
  const postHeader = document.querySelector('.post-header');
  const hasSwitchableNav = header?.querySelector('.nav-body.has-post-title');

  if (!header) {
    return;
  }

  const hasPostTitle = Boolean(postHeader && hasSwitchableNav);
  header.classList.toggle('nav-no-post-title', !hasPostTitle);

  if (!hasPostTitle) {
    header.classList.remove('nav-collapsed');
    setTopNavButtonsFocusable(true);
    setBackToTopButtonVisible(false);
    return;
  }

  const headerHeight = header.getBoundingClientRect().height;
  const postHeaderBottom = postHeader.getBoundingClientRect().bottom;
  const shouldCollapse = postHeaderBottom <= headerHeight;

  header.classList.toggle('nav-collapsed', shouldCollapse);
  setTopNavButtonsFocusable(!shouldCollapse);
  setBackToTopButtonVisible(shouldCollapse);
};

const installPostNavSwitch = () => {
  ensureBackToTopButton();
  let ticking = false;

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updatePostNavCollapsedState();
    });
  };

  updatePostNavCollapsedState();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
};

document.addEventListener('DOMContentLoaded', () => {
  installSidebarSwitch();
  installPostNavSwitch();
});
