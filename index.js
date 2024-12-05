const addContactButtonElement = document.querySelector(".add-contact");
const searchInputElement = document.querySelector(".search-bar input");

const editContactPopupElement = document.querySelector(".popup-edit-contact");
const editContactFormElement = editContactPopupElement.querySelector("form");

const addContactPopupElement = document.querySelector(".popup-add-new-contact");
const addContactFormElement = addContactPopupElement.querySelector("form");

addContactFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");

  addNewContact(name.value, phone.value);

  name.value = "";
  phone.value = "";

  addContactPopupElement.classList.remove("active");
});

editContactFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("editName");
  const phone = document.getElementById("editPhone");

  editContact(name.value, phone.value);

  name.value = "";
  phone.value = "";

  editContactPopupElement.classList.remove("active");
});

addContactButtonElement.addEventListener("click", openAddContact);

searchInputElement.addEventListener("input", (event) => {
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  const searchTerm = event.target.value.toLowerCase();
  const filteredContacts = contacts.filter(({ name }) => {
    return name.toLowerCase().includes(searchTerm);
  });

  renderContacts(filteredContacts);
});

document.addEventListener("click", (event) => {
  const isClickOnAddButton = addContactButtonElement.contains(event.target);
  const isClickInsideAddNewPopup = addContactFormElement.contains(event.target);

  if (!isClickOnAddButton && !isClickInsideAddNewPopup) {
    addContactPopupElement.classList.remove("active");
  }

  const isClickOnEditButton = event.target.classList.contains("edit");
  const isClickInsideEditPopup = editContactFormElement.contains(event.target);

  if (!isClickOnEditButton && !isClickInsideEditPopup) {
    editContactPopupElement.classList.remove("active");
  }
});

function showPhoneNumber(e) {
  const liElement = e.target;
  const phoneElement = liElement.querySelector(".phone");
  phoneElement.classList.toggle("active");
}

function editContact(name, phone) {
  const activeIndex = +editContactPopupElement.getAttribute("activeIndex");
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  const updatedContacts = contacts.map((contact, index) => {
    if (index === activeIndex) {
      return { name, phone };
    }

    return contact;
  });
  localStorage.setItem("contacts", JSON.stringify(updatedContacts));
  editContactPopupElement.removeAttribute("activeIndex");
  renderContacts(updatedContacts);
}

function openEditContact(name, phone, index) {
  editContactPopupElement.setAttribute("activeIndex", index);

  editContactPopupElement.querySelector("#editName").value = name;
  editContactPopupElement.querySelector("#editPhone").value = phone;

  editContactPopupElement.classList.add("active");
}

function addNewContact(name, phone) {
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  contacts.push({ name, phone });

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts(contacts);
}

function openAddContact() {
  addContactPopupElement.classList.add("active");
}

function renderContacts(contacts) {
  const contactListElement = document.querySelector(".contact-list");
  contactListElement.innerHTML = "";

  contacts.forEach(({ name, phone }, index) => {
    const liElement = document.createElement("li");
    liElement.onclick = showPhoneNumber;

    const linkElement = document.createElement("a");
    linkElement.href = "tel:" + phone;
    linkElement.innerHTML = name;
    liElement.appendChild(linkElement);

    const editIcon = document.createElement("img");
    editIcon.classList.add("edit");
    editIcon.src = "./public/editIcon.png";
    editIcon.onclick = () => openEditContact(name, phone, index);
    liElement.appendChild(editIcon);

    const phoneElement = document.createElement("p");
    phoneElement.classList.add("phone");
    phoneElement.innerHTML = phone;
    liElement.appendChild(phoneElement);

    contactListElement.appendChild(liElement);
  });
}

const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
renderContacts(contacts);
