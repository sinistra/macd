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
      console.log(data);
      selectedCompany = data[0].ID;
      selectedCompanyName = data[0].Name;
      console.log(
        "selectedCompany=" + selectedCompany + ", " + selectedCompanyName
      );
      list = data;
      // for (let i = 0; i < data.length; i++) {
        // d.append(
          // '<option value="' + data[i].ID + '">' + data[i].Name + "</option>"
      // );
      // }
      // if (d) {
        // d.hidden = false;
      // }
      dispatch("select", { id: selectedCompany, name: selectedCompanyName });
      isLoading = false;
      // let d = document.getElementById("data_list");
      // d.style.display = "block";
      return;
    } else {
      throw new Error(data);
    }
  }

  onMount(async () => {
    getCompanies(name);
  });

  function handleKeyUp() {
    console.log(event.target.textLength);
    console.log(event.target.value);

    if (event.target.textLength > 0) {
      let d = document.getElementById("data_list");
      let i = document.getElementById("companyselect");

      // console.dir(d);
      d.innerText = "";
      console.log(d);

      getCompanies(name);
      i.focus();
      d.style.display = "block";
    }
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
      type="text"
      name="company"
      id="companyselect"
      bind:value={name}
      list="data_list"
      on:keyup={handleKeyUp}
      placeholder="begin typing name"
      autoComplete="off" />
    {#await list}
      <p>...waiting</p>
    {:then result}

      <datalist id="data_list">
        {#each result as item}
          <option value={item.ID}>{item.Name}</option>
        {/each}
      </datalist>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </selector>
{/if}
