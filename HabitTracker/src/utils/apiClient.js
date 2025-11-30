const API_URL = "http://localhost:8080"; // eller 5158 hos dig

export async function apiGet(endpoint) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
}

export async function apiPost(endpoint, body) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify(body)
  });
  return res.json();
}
