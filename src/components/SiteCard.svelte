<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "fa-svelte";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
  import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
  import { faMobile } from "@fortawesome/free-solid-svg-icons/faMobile";
  import Button from "../UI/Button.svelte";
  import merge from "lodash.merge";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";

  const dispatch = createEventDispatcher();
  let currentToken = null;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  export let site = {
    id: "99999",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: { name: "" },
    phoneNumber: "",
    faxNumber: "",
    taxCodeId: "",
    expenseReimbursement: "",
    primaryAddressFlag: "",
    defaultShippingFlag: "",
    defaultBillingFlag: "",
    defaultMailingFlag: "",
    calendar: "",
    company: {
      name: "",
      id: ""
    },
    _info: "",
    email: ""
  };
  export let macdsite = {
    _id: undefined,
    customer_id: "",
    dgex: "",
    site: {
      id: null,
      code: " ",
      description: ""
    },
    snmp: {
      version: " ",
      v2communitystring: " ",
      v3username: " ",
      v3authstring: " ",
      v3authproto: "",
      v3privstring: "",
      v3privproto: ""
    },
    contact: {
      id: "",
      firstname: " ",
      lastname: " ",
      email: " ",
      phone: " ",
      mobile: " "
    }
  };

  async function getSite(site) {
    // console.log("getSite id = " + site.id);
    const url = environment.baseUrl + `/sites/id/` + site.id;
    // console.log("url = " + url);
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
      // console.log(site);
      data.customer_id = site.company.id.toString();
      // console.log(data);
      return data;
    } else {
      throw new Error(data);
    }
  }

  $: retrievedsite = getSite(site);
  $: macdsite = merge(macdsite, [retrievedsite]);
  $: extendedsite = merge({}, [site, retrievedsite]);
  // $: console.log(retrievedsite);
</script>

<style>
  .card {
    width: 90vw;
    max-width: 30rem;
    margin: 0.5rem;
    /* min-width: 30rem; */
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  h2 {
    padding: 0 0 0.2em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid #ff3e00;
  }

  .card_title {
    width: 100%;
    min-width: 20rem;
    max-width: 30rem;
    margin-bottom: 0.5rem;
  }
  .card_section {
    min-width: 10rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
  }
  .card_buttons {
    width: 100%;
    /* min-width: 20rem; */
    margin-bottom: 0.5rem;
    text-align: right;
  }
</style>

{#await retrievedsite}
  <p>...waiting for data</p>
{:then retrievedsite}
  <div class="card">
    <div class="card_title">
      <h2 class="card-title">{site.name}</h2>
    </div>
    <div class="card_section">
      {retrievedsite.contact.firstname} {retrievedsite.contact.lastname}
      <br />
      {site.addressLine1}
      <br />
      {site.addressLine2}
      <br />
      {site.city} {site.state} {site.zip}
      <br />
      {site.country.name}
    </div>
    <div class="card_section">
      <Icon icon={faEnvelope} />
      {retrievedsite.contact.email}
      <br />
      <Icon icon={faPhone} />
      {retrievedsite.contact.phone}
      <br />
      <Icon icon={faMobile} />
      {retrievedsite.contact.mobile}
    </div>
    <div class="card_section">
      Site code: {retrievedsite.site.code}
      <br />
      Site ID: {retrievedsite.site.id}
      <br />
      DGeX: {retrievedsite.dgex}
      <br />
    </div>
    <div class="card_section">
      SNMP version: {retrievedsite.snmp.version}
      <br />
      SNMP User: {retrievedsite.snmp.v3username}
      <br />
      Authentication:{retrievedsite.snmp.v3authstring} ({retrievedsite.snmp.v3authproto})
      <br />
      Privacy: {retrievedsite.snmp.v3privstring} ({retrievedsite.snmp.v3privproto})
      <br />
    </div>
    <div class="card_buttons">
      <Button
        color="info"
        type="button"
        on:click={() => dispatch('siteEdit', retrievedsite)}>
        Edit
      </Button>
    </div>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
