const loadPhones = async (searchPhone, dataLimit) => {
  const url = `https://openapi.programming-hero.com/api/phones?search=${searchPhone}`;
  const res = await fetch(url);
  const data = await res.json();
  displayPhones(data.data, dataLimit);
};

const displayPhones = (phones, dataLimit) => {
  //   console.log(phones);
  const phonesContainer = document.getElementById("phones-container");

  // erase previous data's when searching
  phonesContainer.innerText = "";

  // display only 12 phones and condition apply if the number of phones is more than 12
  const showMore = document.getElementById("show-more-container");
  if (dataLimit && phones.length > 12) {
    phones = phones.slice(0, 12);
    showMore.classList.remove("d-none");
  } else {
    showMore.classList.add("d-none");
  }

  // display no phone found (error message)
  const noPhoneFound = document.getElementById("no-found-message");
  if (phones.length === 0) {
    noPhoneFound.classList.remove("d-none");
  } else {
    noPhoneFound.classList.add("d-none");
  }

  // display all phones
  phones.forEach((phone) => {
    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("col");
    phoneDiv.innerHTML = `
      <div class="card h-100 p-4 shadow-lg mt-4">
                <img class="h-75" src="${phone.image}" class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">${phone.phone_name}</h5>
                  <p class="card-text"><span class="fw-bold">Brand:</span> ${phone.brand}</p>
                  <button onclick="loadPhoneDetails('${phone.slug}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Details</button>
                </div>
              </div>
      `;
    phonesContainer.appendChild(phoneDiv);
  });

  // stop spinner
  toggleSpinner(false);
};

// get phone details inside the modal when click on the Details button
const loadPhoneDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/phone/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayPhoneDetails(data.data);
};

const displayPhoneDetails = (phone) => {
  console.log(phone);
  const modalLabel = document.getElementById("phoneDetailModalLabel");
  modalLabel.innerText = phone.name;
  const releaseDate = document.getElementById("releaseDate");
  releaseDate.innerHTML = `
    <p><span class="fw-bold">Release Date:</span> ${
      phone.releaseDate ? phone.releaseDate : "No Release Date Found"
    }</p>
    <p><span class="fw-bold">Memory:</span> ${phone.mainFeatures.memory}</p>
    <p><span class="fw-bold">Storage:</span> ${phone.mainFeatures.storage}</p>
    <p><span class="fw-bold">Display:</span> ${
      phone.mainFeatures.displaySize
    }</p>
    <p><span class="fw-bold">Sensors:</span> ${
      phone.mainFeatures.sensors[0]
    }</p>
    `;
  const chipSet = document.getElementById("chipSet");
  chipSet.innerText = phone.mainFeatures.chipSet;
};

// function since 'search button click' and 'Show More buttons' are same
const clickButtons = (dataLimit) => {
  // start spinner
  toggleSpinner(true);

  const searchField = document.getElementById("search-field");
  const searchText = searchField.value;
  loadPhones(searchText, dataLimit);
};

// handle search button click
document.getElementById("button-search").addEventListener("click", function () {
  clickButtons(12);
});

// show rest of data's when clicking on the Show More button (this is not the best way, using just for API limitation)
document.getElementById("show-more-btn").addEventListener("click", function () {
  clickButtons();
});

// execute a function on pressing the enter key in search <input> field
document
  .getElementById("search-field")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      clickButtons(12);
    }
  });

// spinner condition
const toggleSpinner = (isLoading) => {
  const spinnerSection = document.getElementById("spinner");
  if (isLoading) {
    spinnerSection.classList.remove("d-none");
  } else {
    spinnerSection.classList.add("d-none");
  }
};

loadPhones("apple");
