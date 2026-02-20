// ================================
// Contact Manager - Backend API Calls
// ================================

const searchUrl = "API/searchContactsAPI.php";
const addUrl = "addContact.php";
const updateUrl = "updateContact.php";
const deleteUrl = "deleteContact.php";

const form = document.getElementById("contactForm");
const tableBody = document.getElementById("contactTableBody");
const searchInput = document.getElementById("searchInput");
const formTitle = document.getElementById("formTitle");

// ------------------------------
// Auth
// ------------------------------
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function getUserId() {
  // Cookie format from login.js: "firstName=X,lastName=Y,userId=Z" (last call overwrites with userId in lastName position)
  const val = getCookie("firstName");
  if (!val) return null;
  const m = val.match(/lastName=(\d+)/) || val.match(/userId=(\d+)/);
  return m ? m[1] : null;
}

function ensureLoggedIn() {
  const uid = getUserId();
  if (!uid) {
    window.location.href = "index.html";
    return false;
  }
  return uid;
}

function formatDate(dateString) {
    if (!dateString) return "";

    // Convert MySQL "YYYY-MM-DD HH:MM:SS" to ISO format
    const isoString = dateString.replace(" ", "T") + "Z";
    const date = new Date(isoString);

    return date.toLocaleString(); // Converts to user's local timezone
}

// ------------------------------
// API Helper
// ------------------------------
async function apiCall(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${text.slice(0, 100)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response: " + text.slice(0, 100));
  }
}

// ------------------------------
// Load / Search Contacts
// ------------------------------
async function loadContacts(search = "") {
  const userId = ensureLoggedIn();
  if (!userId) return;

  const data = await apiCall(searchUrl, { userId, search });
  if (data.error) {
    alert(data.error);
    return;
  }
  renderContacts(data.contacts || []);
}

// ------------------------------
// Render Table
// ------------------------------
function renderContacts(list) {
  tableBody.innerHTML = "";
  if (!list || list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No contacts found.</td></tr>`;
    return;
  }
  list.forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.firstName} ${c.lastName}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${formatDate(c.dateCreated) || ""}</td>
      <td>
        <button onclick="editContact(${c.id})">Edit</button>
        <button onclick="deleteContact(${c.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// ------------------------------
// Create / Update Contact
// ------------------------------
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = ensureLoggedIn();
  if (!userId) return;

  const id = document.getElementById("contactId").value;
  const payload = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    userId: parseInt(userId, 10)
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    if (id) {
      payload.id = parseInt(id, 10);
      const data = await apiCall(updateUrl, payload);
      if (data.error) {
        alert(data.error);
        return;
      }
    } else {
      const data = await apiCall(addUrl, payload);
      if (data.error) {
        alert(data.error);
        return;
      }
    }
  } catch (err) {
    alert("Error saving contact: " + err.message);
    return;
  }

  form.reset();
    document.getElementById("contactId").value = "";

    formTitle.textContent = "Add Contact";
  loadContacts(searchInput.value);
});

// ------------------------------
// Edit (load into form)
// ------------------------------
async function editContact(id) {
  const userId = ensureLoggedIn();
  if (!userId) return;
  const data = await apiCall(searchUrl, { userId, search: "" });
  const contacts = data.contacts || [];
  const c = contacts.find(x => x.id === id);
  if (!c) return;
  document.getElementById("contactId").value = c.id;
  document.getElementById("firstName").value = c.firstName;
  document.getElementById("lastName").value = c.lastName;
  document.getElementById("email").value = c.email;
  document.getElementById("phone").value = c.phone;

    formTitle.textContent = "Edit Contact";
}

// ------------------------------
// Delete Contact
// ------------------------------
async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;
  const userId = ensureLoggedIn();
  if (!userId) return;
  const data = await apiCall(deleteUrl, { id, userId: parseInt(userId, 10) });
  if (data.error) {
    alert(data.error);
    return;
  }
  loadContacts(searchInput.value);
}

// ------------------------------
// Search
// ------------------------------
let searchTimeout;
searchInput.addEventListener("input", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadContacts(searchInput.value.trim());
  }, 200);
});

// ------------------------------
// Init
// ------------------------------
loadContacts();
