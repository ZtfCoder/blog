// docs/.vitepress/plugins/markdownImagePreview.js
export default function markdownImagePreview(md) {
  const defaultRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const src = token.attrGet("src");
    const alt = token.content;

    return `<img src="${src}" alt="${alt}" onclick="previewImage('${src}')">`;
  };
}
