'use strict';

const katex = require('katex');
require('katex/contrib/mhchem');
const { marked } = require('marked');

const inlineMathStart = /\B\$\S(?:.*?\S)?\$\B/;
const inlineMathReg = /^\$(\S(?:.*?\S)?)\$\B/;
const blockMathReg = /^\s{0,3}\$\$((?:.|\n.)+?)\n?\$\$/;

marked.use({
  ...hexo.config.marked,
  extensions: [{
    name: 'blockMath',
    level: 'block',
    tokenizer(src) {
      const cap = blockMathReg.exec(src);

      if (cap) {
        return {
          type: 'html',
          raw: cap[0],
          text: katex.renderToString(cap[1], { displayMode: true, output: 'html', throwOnError: false }),
        };
      }
    },
  },
  {
    name: 'inlineMath',
    level: 'inline',
    start(src) {
      return src.search(inlineMathStart);
    },
    tokenizer(src) {
      const cap = inlineMathReg.exec(src);

      if (cap) {
        return {
          type: 'html',
          raw: cap[0],
          text: katex.renderToString(cap[1], { output: 'html', throwOnError: false }),
        };
      }
    },
  }]
});

hexo.extend.renderer.register('md', 'html', ({ text }) => marked(text), true);

const css = hexo.extend.helper.get('css').call(hexo, 'css/katex.min.css');
hexo.extend.filter.register('after_render:html', str => str.replace('</head>', `${css}\n</head>`), 0);
