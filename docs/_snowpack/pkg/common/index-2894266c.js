function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = {c: callback, f: fulfill});
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root.host) {
    return root;
  }
  return document;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
const active_docs = new Set();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  active_docs.add(doc);
  const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
  const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
  if (!current_rules[name]) {
    current_rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1);
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    active_docs.forEach((doc) => {
      const stylesheet = doc.__svelte_stylesheet;
      let i = stylesheet.cssRules.length;
      while (i--)
        stylesheet.deleteRule(i);
      doc.__svelte_rules = {};
    });
    active_docs.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
const null_transition = {duration: 0};
function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const {delay = 0, duration = 300, easing = identity, tick: tick2 = noop, css} = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick2(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const {delay = 0, duration = 300, easing = identity, tick: tick2 = noop, css} = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config();
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = new Map();
  const deltas = new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = new Set();
  const did_move = new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  return new_blocks;
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const {fragment, on_mount, on_destroy: on_destroy2, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy2) {
        on_destroy2.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance, create_fragment, not_equal2, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal: not_equal2,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : options.context || []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance ? instance(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal2($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}

export { get_all_dirty_from_scope as A, get_slot_changes as B, toggle_class as C, update_slot_base as D, bubble as E, check_outros as F, group_outros as G, outro_and_destroy_block as H, update_keyed_each as I, listen as J, run_all as K, add_render_callback as L, globals as M, create_in_transition as N, create_out_transition as O, identity as P, SvelteComponent as S, onDestroy as a, add_flush_callback as b, createEventDispatcher as c, append as d, attr as e, bind as f, binding_callbacks as g, create_component as h, destroy_component as i, detach as j, element as k, init as l, insert as m, mount_component as n, onMount as o, noop as p, set_data as q, space as r, safe_not_equal as s, tick as t, text as u, transition_in as v, transition_out as w, create_slot as x, destroy_each as y, empty as z };
