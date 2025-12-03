const API_URL = "http://localhost:8080";

export async function apiGet(endpoint) { 
  const token = localStorage.getItem("token");
  
  console.log("API GET Request:", { 
    endpoint,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "none"
  });
  
  const res = await fetch(API_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  
  // Hvis unauthorized, returner tomt array i stedet for at kaste fejl
  if (res.status === 401) {
    console.warn("Unauthorized - user not logged in");
    return [];
  }
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  return res.json();
} 

export async function apiPost(endpoint, body) {
  const token = localStorage.getItem("token");
  
  console.log("API POST Request:", {
    endpoint,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "none"
  });
  
  const res = await fetch(API_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API POST Error:", {
      status: res.status,
      statusText: res.statusText,
      error: errorText
    });
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }
  
  return res.json();
}

export async function apiPut(endpoint, body) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(API_URL + endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    console.error("API PUT Error:", {
      status: res.status,
      error: errorText
    });
    throw new Error(`API error: ${res.status}`);
  }
  
  if (res.status === 204) return null; // No Content
  return res.json();
}

export async function apiDelete(endpoint) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(API_URL + endpoint, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    console.error("API DELETE Error:", {
      status: res.status,
      error: errorText
    });
    throw new Error(`API error: ${res.status}`);
  }
  
  if (res.status === 204) return null; // No Content
  return res.json();
}
