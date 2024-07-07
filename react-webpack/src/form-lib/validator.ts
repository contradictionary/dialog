type TCustomValidatorParams<T> = {
  getValidityMessage: (input: T) => string;
  hideError: (input: T) => void;
  showError: (input: T) => void;
  validate?: (input: T, e?: Event) => boolean;
};

type TCustomValidatorReturns<T> = TCustomValidatorParams<T> & {
  readonly valid: boolean;
  readonly validate: () => boolean;
  readonly element: T;
  readonly getValidityMessage: () => string;
};

type TSupportedElementTypes =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  // | HTMLButtonElement
  | HTMLFieldSetElement;

const IgnoredInputTypes = ["hidden", "submit", "button", "reset"];

function CustomValidityHandler<
  ElementGenericType extends TSupportedElementTypes
>(
  element: ElementGenericType,
  {
    getValidityMessage,
    hideError,
    showError,
    validate,
  }: TCustomValidatorParams<ElementGenericType>
): void | TCustomValidatorReturns<ElementGenericType> {
  let _valid = true;
  const { type, form } = element;
  if (IgnoredInputTypes.includes(type)) {
    return;
  }

  element.addEventListener("input", onInput);
  element.addEventListener("change", onChange);
  element.addEventListener("invalid", onInvalid);

  form?.addEventListener?.("reset", onReset);

  function onInput(e: Event) {
    _validated(element, e);
  }

  function onInvalid(e: Event) {
    _validated(element, e);
  }

  function onChange(e: Event) {
    _validated(element, e);
  }

  function onReset(e: Event) {
    _reset(element, e);
  }
  function _validated(input: ElementGenericType, e?: Event) {
    if (validate) {
      const _valid = validate(input, e);
      if (_valid) {
        _reset(element, e);
      } else {
        input.setCustomValidity(getValidityMessage(element));
        showError(input as ElementGenericType);
        setTimeout(() => input.reportValidity());
      }
      return;
    }
    if (e?.type == "invalid") {
      //prevent default error tooltip
      e?.preventDefault();
    }
    _valid = input.validity.valid;
    if (input.validity.valid) {
      _reset(input, e);
    } else {
      input.setCustomValidity(getValidityMessage(element));
      showError(input as ElementGenericType);
      setTimeout(() => input.reportValidity());
    }
  }
  function _reset(element: ElementGenericType, e?: Event) {
    _valid = false;
    element.setCustomValidity("");
    hideError(element);
    element.reportValidity();
  }

  return {
    showError: () => {
      showError(element);
    },
    hideError: () => {
      hideError(element);
    },
    get element() {
      return element;
    },
    getValidityMessage() {
      return getValidityMessage(element);
    },
    validate() {
      _validated(element);
      return _valid;
    },
    get valid() {
      return _valid;
    },
  };
}

type TDropdownWithMandatorySelectionValidator = (
  element: HTMLSelectElement,
  {
    getValidityMessage,
    showError,
    hideError,
  }: TCustomValidatorParams<HTMLSelectElement>
) => void | TCustomValidatorReturns<HTMLSelectElement>;
const DropdownWithMandatorySelectionValidator: TDropdownWithMandatorySelectionValidator =
  (element, { getValidityMessage, showError, hideError }) => {
    function _validate(input: HTMLSelectElement, e?: Event) {
      if (e?.type === "invalid") {
        e.preventDefault();
      }
      return input.selectedIndex < 0 || _isDropdownDefaultValue(input);
    }

    function _isDropdownDefaultValue(element: HTMLSelectElement) {
      return element.value == "default";
    }

    const validater = CustomValidityHandler(element, {
      getValidityMessage,
      showError,
      hideError,
      validate: _validate,
    });

    if (!validater) {
      return;
    }
    return {
      validate() {
        return validater.validate();
      },
      get valid() {
        return validater.valid;
      },
      showError: validater.showError,
      hideError: validater.hideError,
      get element() {
        return validater.element;
      },
      getValidityMessage() {
        return validater.getValidityMessage();
      },
    };
  };

class FormValidator {
  form: HTMLFormElement;
  validators: TCustomValidatorReturns<TSupportedElementTypes>[] = [];
  constructor(form: HTMLFormElement) {
    this.form = form;
  }
}
export { CustomValidityHandler, DropdownWithMandatorySelectionValidator };
