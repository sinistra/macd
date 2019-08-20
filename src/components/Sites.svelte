<script>
  import SiteCard from "./SiteCard.svelte";
  import CustomerSelect from "./CustomerSelect.svelte";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";

  let selectedCompany = "";
  let selectedCompanyName = "";
  let currentToken = null;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  function selectCompany(event) {
    console.log(event);
    selectedCompany = event.detail.id;
    selectedCompanyName = event.detail.name;
    console.log(
      "selectedCompany=" + selectedCompany + ", " + selectedCompanyName
    );
  }

  async function getSites(company) {
    if (!company) {
      return [];
    }
    // console.log("getSites company id = " + company);
    const url = environment.baseUrl + `/companies/` + company + `/sites`;
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
      // console.log(data);
      return data;
    } else {
      throw new Error(data);
    }
  }

  $: sites = getSites(selectedCompany);

</script>

<style>
  sites {
    margin-top: 1rem;
    /* width: 100%; */
    /* display: flex; */
    /* justify-content: center; */
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 1150px) {
    sites {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<CustomerSelect on:select={selectCompany} />

<sites>
  {#await sites}
    <p>...waiting</p>
  {:then sitesresult}
    {#each sitesresult as site}
      <SiteCard {site} on:siteEdit />
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</sites>
