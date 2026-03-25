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

const CARBON_LIGHT_THEME = {
  name: 'carbon-light',
  type: 'light',
  colors: {
    'editor.background': 'var(--layer1)',
    'editor.foreground': 'var(--text-primary)',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: 'var(--green-60)' } },
    { scope: ['keyword', 'storage', 'storage.type'], settings: { foreground: 'var(--blue-60)' } },
    { scope: ['keyword.control', 'keyword.control.flow'], settings: { foreground: 'var(--purple-60)' } },
    { scope: ['keyword.operator', 'keyword.other.unit'], settings: { foreground: 'var(--cyan-60)' } },
    { scope: ['variable', 'variable.other.readwrite', 'identifier'], settings: { foreground: 'var(--blue-60)' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: 'var(--teal-50)' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: 'var(--cyan-40)' } },
    { scope: ['entity.name.tag'], settings: { foreground: 'var(--teal-50)' } },
    { scope: ['constant.numeric'], settings: { foreground: 'var(--green-60)' } },
    { scope: ['constant.language', 'constant.language.boolean', 'constant.language.null'], settings: { foreground: 'var(--gray-100)' } },
    { scope: ['string'], settings: { foreground: 'var(--gray-100)' } },
    { scope: ['string.regexp', 'regexp'], settings: { foreground: 'var(--purple-60)' } },
    { scope: ['constant.character.escape'], settings: { foreground: 'var(--gray-50)' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: 'var(--yellow-60)' } },
    { scope: ['punctuation', 'meta.brace', 'meta.delimiter'], settings: { foreground: 'var(--gray-50)' } },
    { scope: ['markup.heading'], settings: { foreground: 'var(--cyan-60)' } },
    { scope: ['markup.quote'], settings: { foreground: 'var(--gray-60)' } },
    { scope: ['markup.underline.link', 'string.other.link'], settings: { foreground: 'var(--blue-60)' } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: 'var(--red-60)' } },
    { scope: ['meta', 'meta.annotation'], settings: { foreground: 'var(--green-50)' } },
  ],
};

const CARBON_DARK_THEME = {
  name: 'carbon-dark',
  type: 'dark',
  colors: {
    'editor.background': 'var(--layer1)',
    'editor.foreground': 'var(--text-primary)',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: 'var(--green-40)' } },
    { scope: ['keyword', 'storage', 'storage.type'], settings: { foreground: 'var(--blue-50)' } },
    { scope: ['keyword.control', 'keyword.control.flow'], settings: { foreground: 'var(--purple-40)' } },
    { scope: ['keyword.operator', 'keyword.other.unit'], settings: { foreground: 'var(--blue-40)' } },
    { scope: ['variable', 'variable.other.readwrite', 'identifier'], settings: { foreground: 'var(--blue-40)' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: 'var(--teal-30)' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: 'var(--cyan-30)' } },
    { scope: ['entity.name.tag'], settings: { foreground: 'var(--teal-30)' } },
    { scope: ['constant.numeric'], settings: { foreground: 'var(--green-30)' } },
    { scope: ['constant.language', 'constant.language.boolean', 'constant.language.null'], settings: { foreground: 'var(--gray-10)' } },
    { scope: ['string'], settings: { foreground: 'var(--gray-10)' } },
    { scope: ['string.regexp', 'regexp'], settings: { foreground: 'var(--purple-40)' } },
    { scope: ['constant.character.escape'], settings: { foreground: 'var(--gray-20)' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: 'var(--yellow-30)' } },
    { scope: ['punctuation', 'meta.brace', 'meta.delimiter'], settings: { foreground: 'var(--gray-20)' } },
    { scope: ['markup.heading'], settings: { foreground: 'var(--blue-40)' } },
    { scope: ['markup.quote'], settings: { foreground: 'var(--gray-30)' } },
    { scope: ['markup.underline.link', 'string.other.link'], settings: { foreground: 'var(--blue-50)' } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: 'var(--red-50)' } },
    { scope: ['meta', 'meta.annotation'], settings: { foreground: 'var(--green-40)' } },
  ],
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
          light: CARBON_LIGHT_THEME,
          dark: CARBON_DARK_THEME,
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
        light: CARBON_LIGHT_THEME,
        dark: CARBON_DARK_THEME,
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
