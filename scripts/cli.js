'use strict';

const { parse } = require('path');

const newOptions = {
  usage: '[options] <path>',
  arguments: [{ name: 'path', desc: 'Post path.' }],
  options: [
    { name: '-r', desc: 'Replace the current post if existed.' },
    { name: '-t', desc: 'Post title. Wrap it with quotations to escape.' },
    { name: '-l', desc: 'Post layout. Use post, page, draft or whatever you want.' },
  ],
};

const titlecase = hexo.extend.helper.get('titlecase').bind(hexo);
hexo.extend.console.register('new', 'Create a new post.', newOptions, ({ _, l: layout, t: title, r: replace }) => {
  for (const path of _) {
    hexo.post.create({
      path,
      layout,
      title: titlecase(title && !_ ? title : parse(path).name),
    }, replace);
  }
});

const server = hexo.extend.console.get('server');
hexo.extend.console.register('server', server.desc, server.options, function (args) {
  if (!args.m) this.config.html_minifier.exclude = ['**'];

  server.call(this, args);
});