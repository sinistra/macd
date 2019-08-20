<script>
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route, navigate } from "svelte-routing";
  import jwtDecode from "jwt-decode";

  import { token } from "./components/token-store.js";
  import Notification from "./UI/Notification.svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Sites from "./components/Sites.svelte";
  import SiteEdit from "./components/SiteEdit.svelte";
  import Macds from "./components/Macds.svelte";
  import MacdNew from "./components/MacdNew.svelte";
  import MacdEdit from "./components/MacdEdit.svelte";
  import Login from "./components/Login.svelte";
  import Help from "./components/Help.svelte";

  // Used for SSR. A falsy value is ignored by the Router. ###not applicable to SPAs
  export let url = "";

  token.set(localStorage.getItem("token"));
  let decoded = {};

  let site;
  let macd_id;
  let notifications;
  let isLoggedIn = false;

  const unsubscribe = token.subscribe(value => {
    decoded = !value ? {} : jwtDecode(value);
  });

  onDestroy(() => {
    unsubscribe();
  });

  $: isLoggedIn = decoded.hasOwnProperty("username");

  function siteEdit(event) {
    // console.log(event);
    site = event.detail;
    console.log(site);
    navigate("/sites/edit", { replace: false });
  }

  function cancelSite(event) {
    console.log(event);
    site = event.detail;
    navigate("/sites", { replace: false });
  }

  function saveSite(event) {
    console.log(event);
    notifications.success("Record saved", 3000);
    navigate("/sites", { replace: false });
  }

  function macdNew(event) {
    // console.log(event);
    navigate("/macds/create", { replace: false });
  }

  function macdEdit(event) {
    macd_id = event.detail.id;
    console.log("macd_id=" + macd_id);
    navigate("/macds/edit", { replace: false });
  }

  function macdSave(event) {
    macd = event.detail;
    notifications.success("Record saved", 3000);
  }

  function toggle() {
    event.preventDefault();
    user.loggedIn = !user.loggedIn;
  }

  function logout() {
    localStorage.removeItem("token");
  }
</script>

<style>
  main {
    margin-top: 5rem;
    /* margin-bottom: 5rem; */
    width: 100%;
    /* padding: 0.5rem; */
    /* height: calc(100% - 9rem); */
  }

  .user {
    text-align: right;
    margin-right: 20px;
    flex: 1;
  }
</style>

<Router {url}>
  <nav>
    <img src="/images/macd.png" alt="macd" class="brand" />
    {#if isLoggedIn}
      <Link to="macds">Requests</Link>
      <Link to="sites">Sites</Link>
    {/if}
    <Link to="help">Help</Link>
    {#if isLoggedIn}
      <a href="/" class="user" on:click={logout}>{decoded.username}</a>
    {/if}
  </nav>
  <main class="container">
    <Route path="about" component={Help} />
    <Route path="blog/:id" component={Help} />
    <Route path="login" component={Login} />
    <Route path="/macds/create">
      <MacdNew on:save={macdEdit} />
    </Route>
    <Route path="/macds/edit">
      <MacdEdit {macd_id} on:save={macdSave} />
    </Route>
    <Route path="/macds">
      <Macds on:new={macdNew} on:edit={macdEdit} />
    </Route>
    <Route path="/sites/edit">
      <SiteEdit macdsite={site} on:save={saveSite} on:cancel={cancelSite} />
    </Route>
    <Route path="/sites">
      <Sites on:siteEdit={siteEdit} />
    </Route>
    <Route path="/">
      <Macds on:new={macdNew} on:edit={macdEdit} />
    </Route>
  </main>
</Router>

<br />
<Notification bind:this={notifications} />
<!-- <Footer /> -->
