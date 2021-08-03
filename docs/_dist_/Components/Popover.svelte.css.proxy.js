// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".sc-popover.svelte-x1pkfs.svelte-x1pkfs{position:relative}.contents-wrapper.svelte-x1pkfs.svelte-x1pkfs{transform:translate(-50%, -50%);position:absolute;top:50%;left:50%;transition:none;z-index:2;display:none}.contents-wrapper.always-open.svelte-x1pkfs.svelte-x1pkfs{position:initial;transform:none}.contents.svelte-x1pkfs.svelte-x1pkfs{background:#fff;box-shadow:0px 10px 26px rgba(0,0,0,0.4);opacity:.8;padding-top:0;display:none;animation:svelte-x1pkfs-grow 200ms forwards cubic-bezier(.92,.09,.18,1.05)}.contents-wrapper.always-open.svelte-x1pkfs .contents.svelte-x1pkfs{box-shadow:none}.contents-inner.svelte-x1pkfs.svelte-x1pkfs{animation:svelte-x1pkfs-fadeIn 400ms forwards}.contents-wrapper.visible.svelte-x1pkfs.svelte-x1pkfs{display:block}.contents-wrapper.visible.svelte-x1pkfs .contents.svelte-x1pkfs{opacity:1;transform:scale(1);display:block}.contents-wrapper.shrink.svelte-x1pkfs .contents.svelte-x1pkfs{animation:svelte-x1pkfs-shrink 150ms forwards cubic-bezier(.92,.09,.18,1.05)}@keyframes svelte-x1pkfs-grow{0%{transform:scale(.9,.1);opacity:0}30%{opacity:1}100%{transform:scale(1)}}@keyframes svelte-x1pkfs-shrink{0%{transform:scale(1);opacity:1}70%{opacity:1}100%{opacity:0;transform:scale(.9,.1)}}@keyframes svelte-x1pkfs-fadeIn{0%{opacity:0}50%{opacity:0}100%{opacity:1}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}