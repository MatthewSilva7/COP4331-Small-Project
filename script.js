// ================================
// Contact Manager Frontend Script
// ================================

// Load contacts from localStorage or start empty
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// DOM references
const form = document.getElementById("contactForm");
const tableBody = document.getElementById("contactTableBody");
const searchInput = document.getElementById("searchInput");

// ================================
// SAVE TO LOCAL STORAGE
// ================================
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// ================================
// RENDER CONTACT TABLE (READ)
// ================================
function renderContacts(list = contacts) {
  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No contacts found.</td></tr>`;
    return;
  }

  list.forEach(contact => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.firstName} ${contact.lastName}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td>${contact.createdAt}</td>
      <td>
        <button onclick="editContact('${contact.id}')">Edit</button>
        <button onclick="deleteContact('${contact.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ================================
// CREATE + UPDATE
// ================================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("contactId").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Basic validation
  if (!firstName || !lastName || !email || !phone) {
    alert("Please fill out all fields.");
    return;
  }

  if (id) {
    // UPDATE EXISTING CONTACT
    const contact = contacts.find(c => c.id === id);

    if (contact) {
      contact.firstName = firstName;
      contact.lastName = lastName;
      contact.email = email;
      contact.phone = phone;
    }
  } else {
    // CREATE NEW CONTACT
    const newContact = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      phone,
      createdAt: new Date().toLocaleDateString()
    };

    contacts.push(newContact);
  }

  saveContacts();

  form.reset();
  document.getElementById("contactId").value = "";

  renderContacts();
});

// ================================
// EDIT CONTACT (LOAD INTO FORM)
// ================================
function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  document.getElementById("contactId").value = contact.id;
  document.getElementById("firstName").value = contact.firstName;
  document.getElementById("lastName").value = contact.lastName;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone;
}

// ================================
// DELETE CONTACT
// ================================
function deleteContact(id) {
  const confirmed = confirm("Delete this contact?");
  if (!confirmed) return;

  contacts = contacts.filter(c => c.id !== id);
  saveContacts();
  renderContacts();
}

// ================================
// SEARCH CONTACTS
// ================================
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();

  const filtered = contacts.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query)
  );

  renderContacts(filtered);
});

// ================================
// INITIAL LOAD
// ================================
renderContacts();
