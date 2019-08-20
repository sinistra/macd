<script>
  import { createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";
  import Notifications from "../UI/Notification.svelte";

  import Button from "../UI/Button.svelte";
  import TextInput from "../UI/TextInput.svelte";

  import { environment } from "../helpers/environment.js";
  import { token } from "./token-store.js";
  import { isEmpty } from "../helpers/validation.js";

  const dispatch = createEventDispatcher();
  let notifications;

  let user = {
    username: "",
    password: ""
  };

  $: usernameValid = !isEmpty(user.username);
  $: passwordValid = !isEmpty(user.password);
  $: formIsValid = usernameValid && passwordValid;

  function submitForm() {
    // console.log(user);
    login();
  }

  async function login() {
    const url = environment.baseUrl + `/login`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();

    if (res.ok) {
      // console.log(data);
      localStorage.setItem("token", data.token);
      token.set(data.token);
      navigate("/", { replace: true });
      return data;
    } else {
      console.log(data);
      notifications.warning("Authentication failed", 3000);
    }
  }

  function cancel() {
    console.log("login cancelled");
    navigate("/", { replace: true });
  }
</script>

<style>
  .card {
    width: 90%;
    margin: auto;
    margin-top: 10rem;
    margin-bottom: 5rem;
    max-width: 30rem;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
  }
</style>

<div class="card">
  <form on:submit={submitForm}>
    <TextInput
      id="username"
      label="Username"
      valid={usernameValid}
      validityMessage="Please enter a username."
      value={user.username}
      on:input={event => (user.username = event.target.value)} />
    <TextInput
      id="password"
      label="Password"
      type="password"
      valid={passwordValid}
      validityMessage="Please enter a password."
      value={user.password}
      on:input={event => (user.password = event.target.value)} />
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}>
      Login
    </Button>
  </form>
</div>
<Notifications bind:this={notifications} />
