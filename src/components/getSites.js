import { environment } from "../helpers/environment.js";
import { token } from "./token-store.js";

// export default function getSites(company) {
//   console.log(company);
//   if (!company) {
//     return [];
//   }

//   console.log("getSites company id = " + company);
//   const url = `http://localhost:8000/companies/` + company + `/sites`;
//   console.log(url);

//   fetch(url, {
//       method: "GET",
//       body: null,
//       headers: { "Content-Type": "application/json" }
//     })
//       .then(res => {
//         if (!res.ok) {
//           throw new Error("An error occurred, please try again!");
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log("fetch getSites response");
//         console.log(data);
//       })
//       .catch(err => {
//         console.log(err);
//       });
// }

export default async function getSites(company) {
  if (!company) {
    return [];
  }
  // console.log("getSites company id = " + company);
  const url = environment.baseUrl + `/companies/` + company + `/sites`;
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
    // console.log(data);
    return data;
  } else {
    throw new Error(data);
  }
}