<script>
  import Select from "svelte-select";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const items = [];
  let currentToken = null;
  let selectedValue = null;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  async function getCompanies(filterText) {
    filterText = filterText ? filterText.replace(" ", "_") : "";

    const url = environment.baseUrl + `/companies?name=` + filterText;
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
      return data;
    } else {
      throw new Error(data);
    }
  }

  const optionIdentifier = "ID";
  const getOptionLabel = option => option.Name;
  const getSelectionLabel = option => option.Name;

  function handleSelect() {
    console.log(selectedValue);
    // console.log(event.target.innerText);
    // console.log(event);
    // let result = getCompanies(event.target.innerText).then(response => {
      // console.log(response);
      // console.log(response[0].ID);
      // console.log(response[0].Name);
      dispatch("select", { id: selectedValue.ID, name: selectedValue.Name });
    // });
  }
  
  function handleClear() {
    console.log(event);
    dispatch("select", { id: null, name: null });
  }
</script>

<style>
  /* CSS variables can be used to control theming. */
  /* https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md */

  .themed {
    --border: 3px solid lightgrey;
    --borderRadius: 8px;
    /* --placeholderColor: darkgrey; */
    --borderFocusColor: #212121;
    --itemHoverBG: #ef9a9a;

    /* width: 100%; */
    width: 90%;
    max-width: 30rem;
    margin: auto;
  }


</style>

<div class="themed">
  <Select
    loadOptions={getCompanies}
    {optionIdentifier}
    {getSelectionLabel}
    {getOptionLabel}
    {items}
    bind:selectedValue
    placeholder="Search for Company"
    on:select={handleSelect}
    on:clear={handleClear} />
</div>
