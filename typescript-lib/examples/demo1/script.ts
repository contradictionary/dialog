const [form, submitBtn] = Array.from(
  document.querySelectorAll("#demoform1,[type=submit]")
);
const validator = new FormValidator(form);

const getErrorElement = (element) => {
  /**@type */
  let msgElement;
  if (element.validity.valueMissing) {
    msgElement = element.parentElement.querySelector("[data-error-missing]");
  } else {
    msgElement = element.parentElement.querySelector("[data-error-invalid]");
  }
  return msgElement;
};
/**
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element
 * @param {Event} [e]
 */
function showRequiredMessage(element, e) {
element.classList.add('border-red-300');
  getErrorElement(element)?.classList?.remove("hidden");
}
function hideRequiredError(element, e) {
element.classList.remove('border-red-300');
  element.parentElement.querySelector("[data-error-missing]")?.classList?.add("hidden");
  element.parentElement.querySelector("[data-error-invalid]")?.classList?.add("hidden");
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
submitBtn.addEventListener("click", (e) => {
  console.log("submit click");
});
form.addEventListener("show-custom-error", ({detail}) => {
  if (!detail) {
    return;
  }
  const { element, event } = detail;
  showRequiredMessage(element, event);
});
form.addEventListener("hide-custom-error", ({detail}) => {
  if (!detail) {
    return;
  }
  const { element, event } = detail;
  hideRequiredError(element, event);
});

form.addEventListener("custom-validity-message", ({detail}) => {
  if (!detail) {
    return;
  }
  const { element } = detail;
  detail.message = getErrorElement(element)?.textContent;
});
