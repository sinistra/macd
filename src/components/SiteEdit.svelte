<script>
  import { onMount, createEventDispatcher } from "svelte";

  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import Select from "../UI/Select.svelte";
  import { isEmpty, isValidEmail } from "../helpers/validation.js";
  import loadOptions from "./getContacts.js";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";

  const dispatch = createEventDispatcher();
  let currentToken = null;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  export let macdsite = null;
  console.log(macdsite);

  let contacts = [];
  let contactsArray = [];
  const bearer = "Bearer " + currentToken;

  $: contacts = getContacts(macdsite.customer_id);
  $: codeValid = !isEmpty(macdsite.site.code);
  $: descriptionValid = !isEmpty(macdsite.site.description);
  $: dgexValid = !isEmpty(macdsite.dgex);
  $: contactValid = macdsite.contact.id > 0;
  $: formIsValid = codeValid && descriptionValid && contactValid && dgexValid;

  onMount(() => {
    if (!currentToken) {
      navigate("/login", { replace: false });
      return;
    }

    if (!macdsite) {
      navigate("/sites", { replace: false });
      return;
    }
  });

  function submitForm() {
    console.log(macdsite);
    const url = environment.baseUrl + `/sites`;
    // console.log("url = " + url);

    if (macdsite._id) {
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(macdsite),
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log(res);
          if (!res.ok) {
            throw new Error("An error occurred, please try again!");
          }
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(macdsite),
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (!res.ok) {
            console.log(res);
            throw new Error("An error occurred, please try again!");
          }
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    }
    dispatch("save");
  }

  function deleteSite() {
    const url = environment.baseUrl + `/sites/` + macdsite._id;
    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          console.log(res);
          throw new Error("An error occurred, please try again!");
        }
      })
      .catch(err => console.log(err));
    dispatch("save");
  }

  async function getContacts(id) {
    if (!id) {
      return [];
    }
    // console.log("getContacts id = " + id);
    const url = environment.baseUrl + `/companies/` + id + `/contacts`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();

    if (res.ok) {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        data[i].name = data[i].firstName + " " + data[i].lastName;
      }
      // console.log(data);
      contactsArray = data;
      return data;
    } else {
      throw new Error(data);
    }
  }

  function cancel() {
    console.log(event);
    dispatch("cancel");
  }

  function selectChange(event) {
    macdsite.contact.id = event.detail.id;
    const thisContact = contactsArray.find(
      contact => contact.id == macdsite.contact.id
    );
    // console.log(thisContact);
    macdsite.contact.firstname = thisContact.firstName;
    macdsite.contact.lastname = thisContact.lastName;

    const thisEmail = thisContact.communicationItems.find(
      item => item.communicationType == "Email"
    );
    macdsite.contact.email =
      typeof thisEmail === "object" ? thisEmail.value : "";

    const thisMobile = thisContact.communicationItems.find(
      item => item.type.name == "Mobile"
    );
    macdsite.contact.mobile =
      typeof thisMobile === "object" ? thisMobile.value : "";

    const thisPhone = thisContact.communicationItems.find(
      item => item.type.name == "Direct"
    );
    macdsite.contact.phone =
      typeof thisPhone === "object" ? thisPhone.value : "";
  }
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Edit Site ({macdsite.site.id})" on:cancel>
  <form on:submit={submitForm}>
    <TextInput
      id="code"
      label="Code"
      valid={codeValid}
      validityMessage="Please enter a valid code."
      value={macdsite.site.code}
      on:input={event => (macdsite.site.code = event.target.value)} />
    <TextInput
      id="description"
      label="Description"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      value={macdsite.site.description}
      on:input={event => (macdsite.site.description = event.target.value)} />
    <TextInput
      id="dgex"
      label="DGeX"
      valid={dgexValid}
      validityMessage="Please enter a DGeX."
      value={macdsite.dgex}
      on:input={event => (macdsite.dgex = event.target.value)} />
    <Select
      items={contacts}
      filter={macdsite.customer_id}
      id="contact"
      label="Contact"
      valid={contactValid}
      validityMessage="Please select a valid Contact."
      value={macdsite.contact.id}
      on:change={selectChange} />
    <TextInput
      id="firstname"
      label="First name"
      value={macdsite.contact.firstname}
      on:input={event => (macdsite.contact.firstname = event.target.value)} />
    <TextInput
      id="lastname"
      label="Last name"
      value={macdsite.contact.lastname}
      on:input={event => (macdsite.contact.lastname = event.target.value)} />
    <TextInput
      id="email"
      label="E-Mail"
      type="email"
      value={macdsite.contact.email}
      on:input={event => (macdsite.contact.email = event.target.value)} />
    <TextInput
      id="phone"
      label="Telephone"
      bind:value={macdsite.contact.phone} />
    <TextInput
      id="mobile"
      label="Mobile"
      bind:value={macdsite.contact.mobile} />
    <TextInput
      id="version"
      label="Version"
      value={macdsite.snmp.version}
      on:input={event => (macdsite.snmp.version = event.target.value)} />
    <TextInput
      id="v2communitystring"
      label="V2 Community string"
      value={macdsite.snmp.v2communitystring}
      on:input={event => (macdsite.snmp.v2communitystring = event.target.value)} />
    <TextInput
      id="v3username"
      label="V3 user name"
      value={macdsite.snmp.v3username}
      on:input={event => (macdsite.snmp.v3username = event.target.value)} />
    <TextInput
      id="v3authstring"
      label="V3 authorisation string"
      value={macdsite.snmp.v3authstring}
      on:input={event => (macdsite.snmp.v3authstring = event.target.value)} />
    <TextInput
      id="v3authproto"
      label="V3 authorisation protocol"
      value={macdsite.snmp.v3authproto}
      on:input={event => (macdsite.snmp.v3authproto = event.target.value)} />
    <TextInput
      id="v3privstring"
      label="V3 Privacy string"
      value={macdsite.snmp.v3privstring}
      on:input={event => (macdsite.snmp.v3privstring = event.target.value)} />
    <TextInput
      id="v3privproto"
      label="V3 Privacy protocol"
      value={macdsite.snmp.v3privproto}
      on:input={event => (macdsite.snmp.v3privproto = event.target.value)} />
  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}>
      Save
    </Button>
    {#if macdsite._id}
      <Button type="button" on:click={deleteSite}>Delete</Button>
    {/if}
  </div>
</Modal>
