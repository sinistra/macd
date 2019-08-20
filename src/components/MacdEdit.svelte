<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";
  import Icon from "fa-svelte";
  import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
  import moment from "moment";

  import macds from "./macds-store.js";
  import { token } from "./token-store.js";

  import { environment } from "../helpers/environment.js";
  import {isEmpty, isValidEmail, isValidIPaddress } from "../helpers/validation.js";

  import LoadingSpinner from "../UI/LoadingSpinner.svelte";
  import Error from "../UI/Error.svelte";
  import Button from "../UI/Button.svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Select from "../UI/Select.svelte";
  import Modal from "../UI/Modal.svelte";
  
  import getSites from "./getSites.js";
  import getMacdSite from "./getMacdSite.js";
  import loadOptions from "./getSites.js";

  export let macd_id;
  let selectedMacd = {
    // customer_id: 0
  };
  let isLoading = true;
  let unsubscribe;

  let currentToken = null;

  const unsubtoken = token.subscribe(value => {
    currentToken = value;
  });

  const bearer = "Bearer " + currentToken;

  const dispatch = createEventDispatcher();
  let filter;
  const newDevice = {
    name: "",
    ip_address: "",
    ping_status: "none",
    snmp_status: "none",
    site_id: 0,
    site_name: "",
    site_code: "",
    monitor_enable: false,
    snmp_enable: false,
    wmi_enable: false,
    snmp: {
      version: "",
      v2communitystring: "",
      v3username: "",
      v3authstring: "",
      v3authproto: "",
      v3privstring: "",
      v3privproto: ""
    }
  };
  let currentDevice = newDevice;
  let currentDevice_id = -1;
  let sitesArray = [];

  $: ipaddressValid = isValidIPaddress(currentDevice.ip_address);
  $: sitenameValid = !isEmpty(currentDevice.site_name);
  $: sitecodeValid = !isEmpty(currentDevice.site_code);
  $: formIsValid = ipaddressValid && sitenameValid && sitecodeValid;
  $: filter = selectedMacd.customer_id;
  $: sites = getSites(selectedMacd.customer_id).then(function(value) {
    // console.log(value);
    sitesArray = value;
  });

  onMount(async () => {
    if (!currentToken) {
      navigate("/login", { replace: false });
      return;
    }

    if (!macd_id) {
      navigate("/macds", { replace: false });
      return;
    }

    isLoading = true;
    if (macd_id) {
      unsubscribe = macds.subscribe(items => {
        selectedMacd = items.find(i => i._id === macd_id);
        console.log(selectedMacd);
      });
      sites = getSites(selectedMacd.customer_id).then(function(value) {
        // console.log(value);
        sitesArray = value;
      });

      if (!selectedMacd.hasOwnProperty("devices")) {
        console.log("no devices in macd");
        selectedMacd.devices = [];
      }
      isLoading = false;
    }
  });

  onDestroy(() => {
    unsubscribe();
  });

  function addDevice() {
    // console.log("selectedMacd.devices=" + selectedMacd.devices.length);
    currentDevice = newDevice;
    if (selectedMacd.devices.length > 0) {
      currentDevice.snmp =
        selectedMacd.devices[selectedMacd.devices.length - 1].snmp;
    }
    currentDevice_id = -1;
    showModal();
  }

  function editDevice(event) {
    const id = event.target.closest("tr").id;
    currentDevice = selectedMacd.devices[id];
    currentDevice_id = id;
    console.log(currentDevice);
    showModal();
  }

  function deleteDevice() {
    let existingDeviceArray = [...selectedMacd.devices];
    var removed = existingDeviceArray.splice(currentDevice_id, 1);
    selectedMacd.devices = [...existingDeviceArray];
    updateMacd();
    closeModal();
  }

  function updateMacd() {
    const url = environment.baseUrl + `/macds`;

    fetch(url, {
      method: "PUT",
      body: JSON.stringify({ ...selectedMacd }),
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("An error occurred, please try again!");
        }
        return res.json();
      })
      .then(data => {
        // console.log("fetch put response");
        console.log(data);
        macds.updateMacd({
          ...selectedMacd
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  function submitForm() {
    if (currentDevice_id < 0) {
      let existingDeviceArray = selectedMacd.devices;
      currentDevice.name =
        currentDevice.ip_address + "_" + currentDevice.site_code;
      existingDeviceArray.push(currentDevice);
      selectedMacd.devices = [...existingDeviceArray];
    } else {
      selectedMacd.devices[currentDevice_id] = currentDevice;
      // console.log(selectedMacd.devices);
    }
    updateMacd();
    closeModal();
  }

  function cancel() {
    // console.log(event);
    closeModal();
  }

  function showModal() {
    // console.log(currentDevice);
    var modal = document.getElementById("modal");
    modal.style.display = "block";
  }

  function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
  }

  function selectChange(event) {
    currentDevice.site_id = event.detail.id;
    currentDevice.site_name = event.detail.name;
    let macdSite = undefined;
    let temp = getMacdSite(currentDevice.site_id).then(function(value) {
      console.log(value);
      macdSite = value;
      currentDevice.snmp = macdSite.snmp;
    });
  }

  function closeEdit() {
    // console.log(event);
    navigate("/macds", { replace: false });
  }

  function formatDate(dateString) {
    let date = new moment.parseZone(dateString);
    return date.format('d/MM/YYYY h:m');
  }
</script>

<style>
  h1 {
    margin-left: auto;
    margin-right: auto;
  }
  div.form {
    width: 90%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
  }

  div.label {
    width: 33%;
    float: left;
    padding: 5px;
  }

  div.data {
    margin-left: 33%;
    padding: 5px;
  }

  div :global(.button-round) {
    text-align: right;
    color: deepskyblue;
    font-size: 14px;
    width: 3em;
    height: 3em;
  }

  div :global(hover) {
    color: skyblue;
  }

  #modal {
    display: none;
  }

  .w15 {
    width: 15%;
  }
  .w25 {
    width: 25%;
  }
  .w40 {
    width: 40%;
  }
  .row {
    background-color: lightgrey;
    vertical-align: middle;
  }
  .row-header {
    background-color: #cf142b;
    vertical-align: middle;
  }

  /* checkbox */
  .inline > label {
    display: inline-block;
    margin-right: 30px;
  }
  /* end checkbox */

  #buttonRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<h1>Edit MACD</h1>
{#if isLoading}
  <LoadingSpinner />
{:else}
  <div class="form">
    <div class="label">Customer</div>
    <div class="data">{selectedMacd.customer_name}</div>
    <div class="label">Created by</div>
    <div class="data">{selectedMacd.created_by}</div>
    <div class="label">Date</div>
    <div class="data">{formatDate(selectedMacd.request_date)}</div>
    <div class="label">Status</div>
    <div class="data">{selectedMacd.status}</div>
    {#if selectedMacd.devices.length > 0}
      <table>
        <tr class="row-header">
          <th class="w25">IP</th>
          <th class="w40">DeviceName</th>
          <th class="w15">Ping</th>
          <th class="w15">SNMP</th>
          <th />
        </tr>
        {#each selectedMacd.devices as device, id}
          <tr {id} class="row">
            <td class="w25">{device.ip_address}</td>
            <td class="w40">{device.name}</td>
            <td class="w15">{device.ping_status}</td>
            <td class="w15">{device.snmp_status}</td>
            <td>
              <Button on:click={editDevice}>Edit</Button>
            </td>
          </tr>
        {/each}
      </table>
    {:else}
      <p>There are no devices - add one.</p>
    {/if}
    <div id="buttonRow">
      <Button type="button" mode="outline" on:click={closeEdit}>Back</Button>
      <button
        style="background-color: transparent; border: none;"
        on:click={addDevice}>
        <Icon class="button-round" icon={faPlusCircle} />
      </button>
    </div>
  </div>

  <div id="modal">
    <Modal title="Edit Device" on:cancel>
      <form on:submit={submitForm}>
        <TextInput
          id="ip_address"
          label="IP Address"
          valid={ipaddressValid}
          validityMessage="Please enter a valid IP address."
          value={currentDevice.ip_address}
          on:input={event => (currentDevice.ip_address = event.target.value)} />
        <Select
          items={sites}
          filter={selectedMacd.customer_id}
          {loadOptions}
          id="site"
          label="Site"
          valid={sitenameValid}
          validityMessage="Please enter a valid Sitename."
          value={currentDevice.site_id}
          on:change={selectChange} />
        <TextInput
          id="sitecode"
          label="Site code"
          valid={sitecodeValid}
          validityMessage="Please enter a valid site code."
          value={currentDevice.site_code}
          on:input={event => (currentDevice.site_code = event.target.value)} />
        <div class="inline">
          <label>
            <input
              type="checkbox"
              bind:checked={currentDevice.monitor_enable} />
            Add to monitoring
          </label>
          <label>
            <input type="checkbox" bind:checked={currentDevice.snmp_enable} />
            SNMP enabled
          </label>
          <label>
            <input type="checkbox" bind:checked={currentDevice.wmi_enable} />
            WMI enabled
          </label>
        </div>
        <div class="inline">
          <label>
            <input
              type="radio"
              bind:group={currentDevice.snmp.version}
              value={'2'} />
            V2C
          </label>
          <label>
            <input
              type="radio"
              bind:group={currentDevice.snmp.version}
              value={'3'} />
            V3
          </label>
        </div>
        <TextInput
          id="v2communitystring"
          label="V2 Community string"
          disabled={currentDevice.snmp.version != '2' ? 'disabled' : ''}
          value={currentDevice.snmp.v2communitystring}
          on:input={event => (currentDevice.snmp.v2communitystring = event.target.value)} />
        <TextInput
          id="v3username"
          label="V3 user name"
          disabled={currentDevice.snmp.version != '3' ? 'disabled' : ''}
          value={currentDevice.snmp.v3username}
          on:input={event => (currentDevice.snmp.v3username = event.target.value)} />
        <TextInput
          id="v3authstring"
          label="V3 authorisation string"
          disabled={currentDevice.snmp.version != '3' ? 'disabled' : ''}
          value={currentDevice.snmp.v3authstring}
          on:input={event => (currentDevice.snmp.v3authstring = event.target.value)} />
        <TextInput
          id="v3authproto"
          label="V3 authorisation protocol"
          disabled={currentDevice.snmp.version != '3' ? 'disabled' : ''}
          value={currentDevice.snmp.v3authproto}
          on:input={event => (currentDevice.snmp.v3authproto = event.target.value)} />
        <TextInput
          id="v3privstring"
          label="V3 Privacy string"
          disabled={currentDevice.snmp.version != '3' ? 'disabled' : ''}
          value={currentDevice.snmp.v3privstring}
          on:input={event => (currentDevice.snmp.v3privstring = event.target.value)} />
        <TextInput
          id="v3privproto"
          label="V3 Privacy protocol"
          disabled={currentDevice.snmp.version != '3' ? 'disabled' : ''}
          value={currentDevice.snmp.v3privproto}
          on:input={event => (currentDevice.snmp.v3privproto = event.target.value)} />
      </form>
      <div slot="footer">
        <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
        <Button type="button" on:click={submitForm} disabled={!formIsValid}>
          Save
        </Button>
        {#if currentDevice_id >= 0}
          <Button type="button" on:click={deleteDevice}>Delete</Button>
        {/if}
      </div>
    </Modal>
  </div>
{/if}
