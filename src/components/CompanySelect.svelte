<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from "../UI/LoadingSpinner.svelte";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";

  let selectedCompany = "";
  let selectedCompanyName = "";
  let currentToken = null;
  let name = "";
  const dispatch = createEventDispatcher();
  let isLoading = true;
  let error;
  let list = [];

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  async function getCompanies(name) {
    isLoading = true;
    const url = environment.baseUrl + `/companies?name=` + name;
    const bearer = "Bearer " + currentToken;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json;charset=utf-8"
      }
    });
    const data = await res.json();

    if (res.ok) {
      selectedCompany = data[0].ID;
      selectedCompanyName = data[0].Name;
      // console.log("selectedCompany=" + selectedCompany + ", "+ selectedCompanyName);
      dispatch("select", { id: selectedCompany, name: selectedCompanyName });
      isLoading = false;
      return data;
    } else {
      throw new Error(data);
    }
  }

  onMount(async () => {
    list = getCompanies(name);
  });

  function handleKeyUp() {
    list = getCompanies(name);
  }

  function selectCompany(event) {
    var e = document.getElementById("companyselect");
    selectedCompany = e.options[e.selectedIndex].value;
    selectedCompanyName = e.options[e.selectedIndex].text;
    // console.log("selectedCompany=" + selectedCompany + ", "+ selectedCompanyName);
    dispatch("select", { id: selectedCompany, name: selectedCompanyName });
  }
</script>

<style>
  selector {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  #companyFilter {
    margin: 0.5rem;
  }

  .select-css {
    /* display: block; */
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    /* line-height: 1.3; */
    padding: 0.6em 1.4em 0.5em 0.8em;
    /* width: 100%; */
    /* max-width: 100%; */
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    border-radius: 0.5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
  }
  .select-css::-ms-expand {
    display: none;
  }
  .select-css:hover {
    border-color: #888;
  }
  .select-css:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
  .select-css option {
    font-weight: normal;
  }
</style>

{#if error}
  <!-- <Error message={error.message} on:cancel={clearError} /> -->
  <p>error.message</p>
{/if}

{#if isLoading}
  <LoadingSpinner />
{:else}
  <selector>
    <input
      id="companyFilter"
      bind:value={name}
      on:keyup={handleKeyUp}
      placeholder="filter company" />

    {#await list}
      <p>...waiting</p>
    {:then result}
      <select id="companyselect" class="select-css" on:change={selectCompany}>
        {#each result as item}
          <option value={item.ID}>{item.Name}</option>
        {/each}
      </select>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </selector>
{/if}
