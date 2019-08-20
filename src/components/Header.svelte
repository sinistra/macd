<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../UI/Button.svelte";

  const dispatch = createEventDispatcher();
  let user = { loggedIn: false };

  function toggle() {
    user.loggedIn = !user.loggedIn;
  }

  function showSites() {
    // event.preventDefault();
    // dispatch("message", {
      // text: "sites"
    // });
  }
  function showRequests() {
    // event.preventDefault();
    // dispatch("message", {
    //   text: "requests"
    // });
  }
  function showHome() {
    // dispatch("message", {
    //   text: "home"
    // });
  }
</script>

<style>
  header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    height: 4rem;
    background: #cf142b;
    display: flex;
    /* justify-content: center; */
    /* justify-content: space-between; */
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.26);
    z-index: 1;
  }

  h1 {
    color: white;
    /*font-family: "Roboto Slab", serif;*/
    margin: 1rem;
  }

  .user {
    /* margin-left: 1rem; */
    margin-top: 0.5rem;
  }
  .menu {
    margin-left: 1rem;
    margin-top: 0.5rem;
  }

  a {
    color: white;
    text-decoration: none;
    margin: 0rem 1rem;
  }

  a:hover,
  a:active {
    color: lightgray;
  }
</style>

<header>
  <a href="/" on:click={showHome}>
    <h1>macD</h1>
  </a>
  <div class="menu">
    <a href="/sites" on:click={showSites}>Sites</a>
    <a href="/macds" on:click={showRequests}>Requests</a>
  </div>

  <div class="user">
    {#if user.loggedIn}
      <a href="/user" on:click={toggle}>Log out</a>
    {/if}

    {#if !user.loggedIn}
      <a href="/user" on:click={toggle}>Log in</a>
    {/if}
  </div>
</header>
