import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9493559a-52de-43ba-8a3f-31c0f0008fae",
    "Content-Type": "application/json",
  },
});

const cardsList = document.querySelector(".cards__list");
if (!cardsList) {
  console.error("Error: .cards__list element not found!");
}

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__new-post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Edit form elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["edit-profile"];
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const cancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteForm = deleteModal.querySelector(".modal__form-delete");
const modalCloseBtn = deleteModal.querySelector(".modal__close-btn");
// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"];
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardTemplate = document.querySelector("#card-template");
const cardBtn = document.querySelector(".profile__add-btn");
const cardSubmitBtn = cardForm.querySelector(".modal__submit-btn");
const cardNameInput = cardForm.querySelector("#add-card-name-input");
const cardLinkInput = cardForm.querySelector("#add-card-link-input");

// Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

let selectedCard;
let selectedCardId;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

//remove evt.target.classList.toggle("card__like-button_active");
//TODO 1. check whether card is currently liked or not
//const isLiked = ???
//TODO 2. call the changeLikesStatus method, passing it the appropirate arguments
//TODO 3. handle the response (.then and .catch)
//TODO 4. in the .then, toggle active class

// TODO - if the card is liked, set the active class on the card
function handleLike(evt, cardId) {
  const likeBtn = evt.target;
  const isLiked = likeBtn.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      likeBtn.classList.toggle("card__like-btn_liked", !isLiked);
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEsc);
  modal.addEventListener("click", handleOverlay);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEsc);
  modal.removeEventListener("click", handleOverlay);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  console.log("we are checking if it is working.");
  // TODO Change text content to "Saving..."
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
  //TODO - call setButtonText instead
  // submitBtn.textContent = "Save";
}
//TODO - implement loading text for all other form submissions

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

// // Universal Modal Close Button Handler
// document.querySelectorAll(".modal__close").forEach((button) => {
//   const popup = button.closest(".modal");
//   button.addEventListener("click", () => closeModal(popup));
// });

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  api
    .addNewCard(inputValues)
    .then((newCardData) => {
      const cardElement = getCardElement(newCardData);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleEsc(evt) {
  if (evt.key === "Escape") {
    const currentlyOpenedModal = document.querySelector(".modal_is-opened");
    if (currentlyOpenedModal) {
      closeModal(currentlyOpenedModal);
    }
  }
}

function handleOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

// Event listeners
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, settings);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
cardBtn.addEventListener("click", () => openModal(cardModal));

// const closeButtons = document.querySelectorAll('.modal__close');
//closebuttons.forEach((button) => {
// const popup = button.closest('.modal');
//button.addEventListener('click', () => closePopup(popup));
//})
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
cancelBtn.addEventListener("click", () => closeModal(deleteModal));
modalCloseBtn.addEventListener("click", () => closeModal(deleteModal));

deleteForm.addEventListener("submit", handleDeleteSubmit);
avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleNewCardSubmit);

enableValidation(settings);
