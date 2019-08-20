<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../UI/Button.svelte";
  // import CompanySelect from "./CompanySelect.svelte";
  import CustomerSelect from "./CustomerSelect.svelte";
  import Notification from "../UI/Notification.svelte";

  import macds from "./macds-store.js";
  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";
  import jwtDecode from "jwt-decode";

  let selectedCompany = "";
  let selectedCompanyName = "";
  let currentToken = null;
  let notifications;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });

  if (!currentToken) {
    navigate("/login", { replace: true });
  }

  const bearer = "Bearer " + currentToken;
  const decodedToken = jwtDecode(currentToken);

  const dispatch = createEventDispatcher();
  let isLoading = true;
  let error;
  let macd_id;

  function selectCompany(event) {
    selectedCompany = event.detail.id;
    selectedCompanyName = event.detail.name;
    console.log(
      "selectedCompany=" + selectedCompany + ", " + selectedCompanyName
    );
  }

  function createMacd() {
    const macdData = {
      customer_id: selectedCompany.toString(),
      customer_name: selectedCompanyName,
      created_by: decodedToken.username,
      updated_by: decodedToken.username,
      status: "open"
    };
    console.log(macdData);

    const url = environment.baseUrl + "/macds";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...macdData }),
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          notifications.danger("Oh-ho! Something bad happened.", 5000);
          console.log(res);
          throw new Error("An error occurred, please try again!");
        }
        return res.json();
      })
      .then(data => {
        console.log("fetch post response");
        console.log(data);
        macd_id = data;
        macds.addMacd({
          ...macdData,
          _id: data
        });
        console.log("macd_id=" + macd_id);
        notifications.success("New macD added.", 5000);
        dispatch("save", { id: macd_id });
      })
      .catch(err => {
        console.log(err);
      });
  }
</script>

<style>
  .next {
    position: relative;
    width: 80%;
    display: flex;
    justify-content: right;
    margin-top: 5rem;
  }
</style>

{#if error}
  <!-- <Error message={error.message} on:cancel={clearError} /> -->
  <p>error.message</p>
{/if}

<CustomerSelect on:select={selectCompany} />

<div class="next">
  <Button
    type="button"
    color="success"
    on:click={createMacd}
    disabled={!selectedCompany}>
    Next
  </Button>
</div>
<Notification bind:this={notifications} />
