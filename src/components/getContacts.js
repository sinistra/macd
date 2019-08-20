import { environment } from "../helpers/environment.js";
import { token } from "./token-store.js";

export default async function getContacts(id) {
  if (!id) {
    return [];
  }
  console.log("getContacts id = " + id);
  const url = environment.baseUrl + `/companies/` + id + `/contacts`;
  let currentToken = null;

  const unsubscribe = token.subscribe(value => {
    currentToken = value;
  });
  const bearer = "Bearer " + currentToken;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();

  if (res.ok) {
    console.log(data);
    return data;
  } else {
    throw new Error(data);
  }
}