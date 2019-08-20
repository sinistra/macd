<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from "../UI/LoadingSpinner.svelte";

  const dispatch = createEventDispatcher();

  export let items = [];
  export let filter=undefined;
  export let loadOptions=undefined;
  export let id;
  export let label;
  export let value;
  export let valid = true;
  export let validityMessage = "";
  let touched = false;
  let isLoading = true;
  let list = undefined;

  // console.log(items);
  // console.log("filter=" + filter);
  // console.log("value=" + value);

  // $: list = getSites(filter);

  onMount(async () => {
    isLoading = true;
    if (loadOptions) {
      list = loadOptions(filter);
    } else {
      list = items;
    }
    isLoading = false;
  });

  function onChange() {
    touched = true;
    var e = document.getElementById(id);
    console.log(
      "selected:" +
        e.options[e.selectedIndex].value +
        "/" +
        e.options[e.selectedIndex].text
    );
    dispatch("change", {
      id: e.options[e.selectedIndex].value,
      name: e.options[e.selectedIndex].text
    });
  }
</script>

<style>
  select {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  select:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }
  
  @media (min-width: 30rem) {
    select {
      display: inline-block;
      width: 66%;
    }

    label {
      display: inline-block;
      width: 33%;
    }
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }

  .invalid {
    border-color: red;
    background: #fde3e3;
  }

  .error-message {
    color: red;
    margin: 0.25rem 0;
  }
</style>

{#if isLoading}
  <LoadingSpinner />
{:else}
  {#await list}
    <p>...waiting</p>
  {:then result}
    <div class="form-control">
      <label for={id}>{label}</label>
      <select {id} class:invalid={!valid && touched} on:change={onChange}>
        <option value="">Please select ...</option>
        {#if result.length > 0}
          {#each result as item}
            {#if value == item.id}
              <option value={item.id} selected>{item.name}</option>
            {:else}
              <option value={item.id}>{item.name}</option>
            {/if}
          {/each}
        {/if}
      </select>
      {#if validityMessage && !valid && touched}
        <p class="error-message">{validityMessage}</p>
      {/if}
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}
