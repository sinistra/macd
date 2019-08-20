<script>
  let count = 0;
  let toasts = [];

  function animateOut(node, { delay = 0, duration = 300 }) {
    function vhTOpx(value) {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName("body")[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

      return (y * value) / 100;
    }

    return {
      delay,
      duration,
      css: t =>
        `opacity: ${(t - 0.5) *
          1}; transform-origin: top right; transform: scaleX(${(t - 0.5) * 1});`
    };
  }

  function createToast(msg, timeout, theme) {
    toasts = [
      {
        id: count,
        msg,
        theme,
        timeout,
        width: "100%"
      },
      ...toasts
    ];
    count = count + 1;
  }

  export function removeToast(id) {
    toasts = toasts.filter(t => t.id != id);
  }

  export function show(msg, timeout = 3000, theme = "default") {
    createToast(msg, timeout, theme);
  }

  export function danger(msg, timeout) {
    show(msg, timeout, "danger");
  }

  export function warning(msg, timeout) {
    show(msg, timeout, "warning");
  }

  export function info(msg, timeout) {
    show(msg, timeout, "info");
  }

  export function success(msg, timeout) {
    show(msg, timeout, "success");
  }
</script>

<style>
  :global(.toasts) {
    list-style: none;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0;
    margin: 0;
    width: 140px;

    z-index: 9999;
  }

  :global(.toasts) > .toast {
    position: relative;
    margin: 10px;
    /* min-width: 33vw; */
    position: relative;
    animation: animate-in 350ms forwards;
    color: #000;
    border-radius: 6px;
    background-color: #aaaaaa;
  }

  :global(.toasts) > .toast > .content {
    padding: 10px;
    display: block;
    font-weight: 500;
  }

  :global(.toasts) > .toast > .progress {
    position: absolute;
    bottom: 0;
    background-color: rgb(0, 0, 0, 0.3);
    height: 6px;
    width: 100%;
    animation-name: shrink;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  :global(.toasts) > .toast:before,
  :global(.toasts) > .toast:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    bottom: 0;
    left: 10px;
    right: 10px;
    border-radius: 100px / 10px;
  }

  :global(.toasts) > .toast:after {
    right: 10px;
    left: auto;
    transform: skew(8deg) rotate(3deg);
  }

  .danger {
    background-color: #ff5252;
  }
  .info {
    background-color: #4fc3f7;
  }
  .success {
    background-color: #aed581;
  }
  .warning {
    background-color: #ff8a65;
  }

  @keyframes animate-in {
    0% {
      width: 0;
      opacity: 0;
      transform: scale(1.15) translateY(20px);
    }
    100% {
      /* width: 30vw; */
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes shrink {
    0% {
      width: 30vw;
    }
    100% {
      width: 0;
    }
  }
</style>

<ul class="toasts">
  {#each toasts as toast (toast.id)}
    <li
      class="toast {toast.theme}"
      on:click={() => removeToast(toast.id)}
      out:animateOut>
      <div class="content">{toast.msg}</div>
      <div
        class="progress"
        style="animation-duration: {toast.timeout}ms;"
        on:animationend={() => removeToast(toast.id)} />
    </li>
  {/each}
</ul>
