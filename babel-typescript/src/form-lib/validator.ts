import { CreateReadonly } from "./common/type-helpers";
function isInput(element: TSupportedElementTypes): element is HTMLInputElement {
  return element && element.tagName == "INPUT";
}
function isTextarea(
  element: TSupportedElementTypes
): element is HTMLTextAreaElement {
  return element && element.tagName == "TEXTAREA";
}
function isSelectElement(
  element: TSupportedElementTypes
): element is HTMLSelectElement {
  return element && element.tagName == "SELECT";
}
type TCustomValidatorParams<T> = {
  getValidityMessage: (input: T) => string;
  hideError: (input: T) => void;
  showError: (input: T) => void;
  validate?: (input: T, e?: Event) => boolean;
};

type TCustomValidatorReturns<T> = CreateReadonly<{
  valid: boolean;
  validate: () => boolean;
  element: T;
  getValidityMessage: () => string;
  hideError: () => void;
  showError: () => void;
}>;

type TSupportedElementTypes =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  // | HTMLButtonElement
  | HTMLFieldSetElement;

const IgnoredInputTypes = ["hidden", "submit", "button", "reset"];
const getElementForm = (element: TSupportedElementTypes) => {
  let _form = element.form;
  if (!_form) {
    const fieldSet = element.parentElement?.closest("fieldset");
    if (fieldSet) {
      _form = fieldSet.form as HTMLFormElement;
    }
  }
  return _form;
};
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
  const { type } = element;
  if (IgnoredInputTypes.includes(type)) {
    return;
  }

  element.addEventListener("input", onInput);
  element.addEventListener("change", onChange);
  element.addEventListener("invalid", onInvalid);
  const form = getElementForm(element);
  form?.addEventListener("reset", onReset);

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
      return (_valid = element.checkValidity());
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

const TextAreaPatternValidator: typeof CustomValidityHandler<
  HTMLTextAreaElement
> = (
  element: HTMLTextAreaElement,
  { getValidityMessage, showError, hideError }
) => {
  function _validate(element: HTMLTextAreaElement) {
    if (element.value.length == 0) {
      return true; //let the required validation take care of it
    }
    if (element.dataset.pattern) {
      try {
        return new RegExp(element.dataset.pattern, "m").test(element.value);
      } catch (error) {
        console.warn(error);
      }
    }
    return true;
  }
  const validater = CustomValidityHandler(element, {
    getValidityMessage,
    showError,
    hideError,
    validate: _validate,
  });
  return validater;
};

class FormValidator {
  form: HTMLFormElement;
  validators: TCustomValidatorReturns<TSupportedElementTypes>[] = [];
  constructor(form: HTMLFormElement) {
    this.form = form;
    this.init();
  }
  private init() {
    const elements = [
      ...Array.from(this.form.getElementsByTagName("input")),
      ...Array.from(this.form.getElementsByTagName("textarea")),
      ...Array.from(this.form.getElementsByTagName("select")),
    ];
    elements.forEach((s) => {
      const v = this.createValidator(s);
      if (Array.isArray(v)) {
        this.validators.push(...v);
      }
    });
  }
  private createValidator(element: TSupportedElementTypes) {
    let handlers: Array<(...args: any[]) => any> = [];
    switch (true) {
      case isInput(element):
        handlers.push(CustomValidityHandler);
        break;
      case isSelectElement(element):
        if (element.required) {
          handlers.push(DropdownWithMandatorySelectionValidator);
        }
      case isTextarea(element):
        if (element.required) {
          handlers.push(CustomValidityHandler);
        }
        if (element.dataset.pattern) {
          handlers.push(TextAreaPatternValidator);
        }
    }
    if (handlers.length) {
      return handlers.map((handler) =>
        handler(element, {
          getValidityMessage: (s) => this.getValidityMessage(s),
          showError: (s) => this.showError(s),
          hideError: (s) => this.hideError(s),
        })
      );
    }
  }
  protected showError(element: TSupportedElementTypes) {
    element.dispatchEvent(
      new CustomEvent("show-custom-error", {
        detail: {
          validator: this.validators.find((s) => s.element == element),
        },
      })
    );
  }
  protected hideError(element: TSupportedElementTypes) {
    element.dispatchEvent(
      new CustomEvent("hide-custom-error", {
        detail: {
          validator: this.validators.find((s) => s.element == element),
        },
      })
    );
  }
  protected getValidityMessage(element: TSupportedElementTypes): string {
    const e = new CustomEvent("custom-validity-message", {
      detail: {
        validator: this.validators.find((s) => s.element == element),
        message: "",
      },
    });
    element.dispatchEvent(e);
    return e.detail?.message || "";
  }
  get valid() {
    return this.validators.every((s) => s.valid);
  }
  validate() {
    return this.validators.every((s) => s.validate());
  }
}
export { FormValidator };
