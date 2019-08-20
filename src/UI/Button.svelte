<script>
  export let type = "button";
  export let href = null;
  export let mode = null;
  export let color = null;
  export let shape = null;
  export let disabled = false;
</script>

<style>
  button,
  a {
    font: inherit;
    border: 1px solid #cf142b;
    background: #cf142b;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
    cursor: pointer;
    text-decoration: none;
    margin: 5px;
  }

  button:focus {
    outline: none;
  }

  button:hover,
  button:active,
  a:hover,
  a:active {
    background: #e40763;
    border-color: #e40763;
    box-shadow: 1px 1px 8px rgba(77, 51, 51, 0.26);
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background: #ccc;
    border-color: #ccc;
    color: #959595;
    box-shadow: none;
    cursor: not-allowed;
  }

  .success {
    background: #01a129;
    border-color: #01a129;
  }

  .success:hover,
  .success:active {
    background: #1ac745;
    border-color: #1ac745;
  }
  .info {
    background: #29b6f6;
    border-color: #29b6f6;
  }

  .info:hover,
  .info:active {
    background: #4fc3f7;
    border-color: #4fc3f7;
  }

  .outline {
    background: transparent;
    color: #cf0056;
    box-shadow: none;
  }

  .outline:hover,
  .outline:active {
    background: #ffc7de;
    box-shadow: none;
  }

  .outline:disabled,
  .outline:disabled:hover,
  .outline:disabled:active {
    background: transparent;
    color: #ccc;
  }

  .outline.success {
    border-color: #01a129;
    color: #01a129;
  }

  .outline.success:hover,
  .outline.success:active {
    background: #c2ffd1;
  }

  .round {
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }
</style>

{#if href}
  <a {href}>
    <slot />
  </a>
{:else}
  <button class="{mode} {color} {shape}" {type} on:click {disabled}>
    <slot />
  </button>
{/if}
