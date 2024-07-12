"use strict";
var _a = Array.from(document.querySelectorAll("#demoform1,[type=submit]")), form = _a[0], submitBtn = _a[1];
var validator = new FormValidator(form);
var getErrorElement = function (element) {
    /**@type */
    var msgElement;
    if (element.validity.valueMissing) {
        msgElement = element.parentElement.querySelector("[data-error-missing]");
    }
    else {
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
    var _a, _b;
    element.classList.add('border-red-300');
    (_b = (_a = getErrorElement(element)) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove("hidden");
}
function hideRequiredError(element, e) {
    var _a, _b, _c, _d;
    element.classList.remove('border-red-300');
    (_b = (_a = element.parentElement.querySelector("[data-error-missing]")) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add("hidden");
    (_d = (_c = element.parentElement.querySelector("[data-error-invalid]")) === null || _c === void 0 ? void 0 : _c.classList) === null || _d === void 0 ? void 0 : _d.add("hidden");
}
form.addEventListener("submit", function (e) {
    e.preventDefault();
});
submitBtn.addEventListener("click", function (e) {
    console.log("submit click");
});
form.addEventListener("show-custom-error", function (_a) {
    var detail = _a.detail;
    if (!detail) {
        return;
    }
    var element = detail.element, event = detail.event;
    showRequiredMessage(element, event);
});
form.addEventListener("hide-custom-error", function (_a) {
    var detail = _a.detail;
    if (!detail) {
        return;
    }
    var element = detail.element, event = detail.event;
    hideRequiredError(element, event);
});
form.addEventListener("custom-validity-message", function (_a) {
    var _b;
    var detail = _a.detail;
    if (!detail) {
        return;
    }
    var element = detail.element;
    detail.message = (_b = getErrorElement(element)) === null || _b === void 0 ? void 0 : _b.textContent;
});
