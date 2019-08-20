<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";

  import macds from "./macds-store.js";
  import { token } from "./token-store.js";
  import { environment } from "../helpers/environment.js";

  import MacdList from "./MacdList.svelte";
  import Button from "../UI/Button.svelte";
  import LoadingSpinner from "../UI/LoadingSpinner.svelte";
  import Error from "../UI/Error.svelte";
  import Notification from "../UI/Notification.svelte";

  export let filter = "";
  const dispatch = createEventDispatcher();
  let isLoading = true;
  let error;
  let currentToken = null;
  let notifications;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });
  const bearer = "Bearer " + currentToken;

  onMount(async () => {
    if (!currentToken) {
      navigate("/login", { replace: true });
      return;
    }
    loadMacds();
  });

  function loadMacds(filter) {
    let url = environment.baseUrl + `/macds`;
    if (filter) {
      url += `?filter=` + filter;
    }
    // console.log("url = " + url);
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Fetching MACDS failed, please see DevOps!");
        }
        return res.json();
      })
      .then(data => {
        const loadedMacds = [];
        for (const key in data) {
          loadedMacds.push({
            ...data[key],
            id: key
          });
        }
        setTimeout(() => {
          isLoading = false;
          macds.setMacds(loadedMacds.reverse());
        }, 1000);
      })
      .catch(err => {
        error = err;
        isLoading = false;
        console.log(err);
        notifications.danger(err, 50000);
      });
  }

  function newMacd() {
    dispatch("new");
  }
</script>

<style>
  .alignright {
    text-align: right;
    align-content: center;
  }
</style>

{#if isLoading}
  <LoadingSpinner />
{:else}
  {#if error}
    <!-- <Error message={error.message} on:cancel={clearError} /> -->
    <p>{error}</p>
  {:else}
    <div class="alignright">
      <Button type="button" on:click={newMacd}>New</Button>
    </div>
    <MacdList on:edit />
  {/if}
{/if}
<Notification bind:this={notifications} />
