<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import moment from "moment";

  import macds from "./macds-store.js";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";
  import Notification from "../UI/Notification.svelte";

  import Icon from "fa-svelte";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
  import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
  import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt";
  import Button from "../UI/Button.svelte";

  const dispatch = createEventDispatcher();
  let macdArray = [];
  let macd_id;
  let isLoading = true;
  let unsubscribe;
  let notifications;
  let currentToken = null;

  const unsubtoken = token.subscribe(value => {
    currentToken = value;
  });

  const bearer = "Bearer " + currentToken;

  onMount(async () => {
    if (!currentToken) {
      navigate("/login", { replace: true });
      return;
    }

    isLoading = true;
    unsubscribe = macds.subscribe(items => {
      macdArray = items;
    });
    isLoading = false;
  });

  onDestroy(() => {
    unsubscribe();
  });

  function editThis(event) {
    var trElement = event.target.closest("tr");
    macd_id = trElement.id;
    dispatch("edit", { id: macd_id });
  }

  function deleteThis(event) {
    var trElement = event.target.closest("tr");
    macd_id = trElement.id;
    // console.log("deleteThis called, macd_id=" + macd_id);
    const thisMacd = macdArray.find(i => i._id == macd_id);
    deleteMacd(thisMacd);

    let existingMacdArray = [...macdArray];
    var removed = existingMacdArray.splice(thisMacd.id, 1);
    macdArray = [...existingMacdArray];
  }

  function deleteMacd(macd) {
    const url = environment.baseUrl + "/macds/" + macd._id;
    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json;charset=utf-8"
      }
    })
      .then(res => {
        if (!res.ok) {
          console.log(res);
          notifications.danger("Oh-ho. Something didn't go to plan.", 3000);
          throw new Error("An error occurred, please try again!");
        }
        return res.json();
      })
      .then(data => {
        macds.removeMacd(macd.id);
        notifications.success("Record deleted.", 3000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  function formatDate(dateString) {
    let date = new moment.parseZone(dateString);
    return date.fromNow();
  }
</script>

<style>
  #macds {
    font-family: inherit;
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
  }

  #macds th,
  #macds td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #macds tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #macds tr:hover {
    background-color: #ddd;
  }

  #macds th {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    text-align: left;
    background-color: #cf142b;
    color: white;
  }

  .col30 {
    width: 33%;
  }
  .col12 {
    width: 12%;
  }
  .col15 {
    width: 15%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .col20 {
    width: 20%;
    text-align: center;
  }
</style>

<macds>
  <p>There are {macdArray.length} MACD requests.</p>
  {#if macdArray.length > 0}
    <table id="macds">
      <tr>
        <th class="col30">Cust.</th>
        <th class="col12">Date</th>
        <th class="col12">Stat.</th>
        <th class="col15">User</th>
        <th class="col20">Action</th>
      </tr>
      {#each macdArray as macd}
        <tr id={macd._id}>
          <td class="col30">{macd.customer_name}</td>
          <td class="col12">{formatDate(macd.request_date)}</td>
          <td class="col12">{macd.status}</td>
          <td class="col15">{macd.created_by}</td>
          <td  class="col20">
            <Button on:click={editThis}>
              <Icon icon={faEdit} />
            </Button>
            <Button on:click={deleteThis}>
              <Icon icon={faTrashAlt} />
            </Button>
          </td>
        </tr>
      {/each}
    </table>
  {/if}
</macds>
<Notification bind:this={notifications} />
