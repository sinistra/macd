import { environment } from "../helpers/environment.js";
import { token } from "./token-store.js";

export default async function getMacdSites(id) {
  if (!id) {
    return [];
  }
  console.log("getMacdSites id = " + id);
  const url = environment.baseUrl + `/sites/id/` + id;
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