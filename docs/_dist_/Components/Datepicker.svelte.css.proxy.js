// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".datepicker.svelte-1m1jgwa.svelte-1m1jgwa{display:inline-block;margin:0 auto;text-align:center;overflow:visible}.calendar-button.svelte-1m1jgwa.svelte-1m1jgwa{padding:10px 20px;border:1px solid var(--button-border-color);display:block;text-align:center;width:300px;text-decoration:none;cursor:pointer;background:var(--button-background-color);color:var(--button-text-color);border-radius:7px;box-shadow:0px 0px 3px rgba(0, 0, 0, 0.1)}.svelte-1m1jgwa.svelte-1m1jgwa,.svelte-1m1jgwa.svelte-1m1jgwa:before,.svelte-1m1jgwa.svelte-1m1jgwa:after{box-sizing:inherit}.calendar.svelte-1m1jgwa.svelte-1m1jgwa{box-sizing:border-box;position:relative;overflow:hidden;user-select:none;width:100vw;padding:10px;padding-top:0;background-color:var(--background-color);color:var(--text-color)}@media(min-width: 480px){.calendar.svelte-1m1jgwa.svelte-1m1jgwa{height:auto;width:340px;max-width:100%}}.legend.svelte-1m1jgwa.svelte-1m1jgwa{color:var(--text-color);padding:10px 0;margin-bottom:5px}.legend.svelte-1m1jgwa span.svelte-1m1jgwa{width:14.285714%;display:inline-block;text-align:center}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}