import { codeToHtml } from 'https://esm.sh/shiki@3.0.0';

const fallbackCopyText = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
  }

  return fallbackCopyText(text);
};

document.addEventListener('DOMContentLoaded', async function() {
  let codeBlocks = document.querySelectorAll('code');

  await Promise.all(Array.from(codeBlocks).map(async function(codeBlock) {

    let language = 'plaintext';
    codeBlock.classList.forEach(cls => {
      if (cls.startsWith('language-')) {
        language = cls.replace('language-', '');
      }
    });

    const pre = codeBlock.parentElement;
    if (!pre.matches('pre')) {
      if (codeBlock.querySelector('.shiki-inline')) return;
      codeBlock.innerHTML = await codeToHtml(codeBlock.textContent, {
        lang: language,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        structure: 'inline'
      });
      codeBlock.classList.add('shiki-inline');
      return;
    }

    if (pre.querySelector('.shiki')) return;
    pre.outerHTML = await codeToHtml(codeBlock.textContent, {
      lang: language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      }
    });
  }));

  codeBlocks = document.querySelectorAll('pre > code');

  codeBlocks.forEach(async function(codeBlock) {
    const pre = codeBlock.parentElement;

    const clone = codeBlock.cloneNode(true);
    const brs = clone.querySelectorAll('br');
    brs.forEach(br => br.replaceWith('\n'));
    
    const text = clone.textContent;
    const cleanText = text.replace(/\n$/, '');
    const lineCount = cleanText.split(/\r\n|\r|\n/).length;

    if (!pre.querySelector('.has-line-numbers')) {
      if (lineCount <= 1) {
        pre.classList.add('single-line');
      } else {
        const rows = document.createElement('span');
        rows.className = 'line-numbers-rows';
        
        for (let i = 1; i <= lineCount; i++) {
          const span = document.createElement('span');
          span.textContent = i;
          rows.appendChild(span);
        }

        pre.prepend(rows);
      }

      pre.classList.add('has-line-numbers');
    }

    if (pre.querySelector('.copy-button')) return;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', '复制代码');
    
    copyButton.addEventListener('click', async function() {
      const copied = await copyText(cleanText);
      if (copied) {
        copyButton.classList.add('copied');
        setTimeout(function() {
          copyButton.classList.remove('copied');
        }, 1000);
      } else {
        copyButton.classList.add('error');
        setTimeout(function() {
          copyButton.classList.remove('error');
        }, 1000);
      }
    });

    pre.style.position = 'relative';
    
    pre.appendChild(copyButton);
  });
});
