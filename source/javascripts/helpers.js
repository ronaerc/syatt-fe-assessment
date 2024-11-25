function isObject(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

function deepMerge(target, ...sources) {
  // Loop through each source object
  sources.forEach((source) => {
    if (!source) return;

    // Loop through each key in the source object
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        // If the value is an object, recursively merge
        if (isObject(source[key])) {
          // If the target doesn't have this key, create an empty object for it
          if (!target[key]) {
            target[key] = {};
          }
          // Recursively merge
          deepMerge(target[key], source[key]);

          // If the value is an array, merge arrays element-wise
        } else if (Array.isArray(source[key])) {
          if (!Array.isArray(target[key])) {
            target[key] = [];
          }

          // Merge arrays element-wise
          source[key].forEach((sourceElement, index) => {
            if (isObject(sourceElement)) {
              // If target has an element at the same index, merge it with source
              if (target[key][index]) {
                deepMerge(target[key][index], sourceElement);
              } else {
                // Otherwise, just assign the source element to that index
                target[key][index] = sourceElement;
              }
            } else {
              // If source element is not an object, simply assign it
              target[key][index] = sourceElement;
            }
          });

          // Otherwise, for primitive values, overwrite the target value
        } else {
          target[key] = source[key];
        }
      }
    }
  });

  return target;
}

function debounce(fn, wait) {
  let timerID;
  return (...args) => {
    clearTimeout(timerID);
    timerID = setTimeout(() => fn.apply(this, args), wait);
  };
}

async function asyncRequest(url, options, responseOptionsOverrides = {}) {
  const responseOptions = deepMerge(
    {
      responseFormat: "text",
      messageOptions: {
        type: "error",
      },
    },
    responseOptionsOverrides
  );

  try {
    const response = await fetch(url, options);
    const data = await response[responseOptions.responseFormat]();
    let error;

    if (response.ok) {
      return data;
    }

    if (data) {
      error = `${response.url} responded with: ${data}`;

      const { description, errors } = JSON.parse(data);
      const message = description || errors;

      if (message) {
        createMessage(message, responseOptions.messageOptions);
      }
    } else {
      error = `${response.url} responded with status: ${response.status} and statusText: ${response.statusText}`;
    }

    throw new Error(error);
  } catch (error) {
    window.console.log(error);
    return false;
  }
}

function replaceDOM(
  html,
  selectorForExisting,
  selectorForNew = selectorForExisting
) {
  const newDOM = new DOMParser()
    .parseFromString(html, "text/html")
    .querySelector(selectorForNew);
  const existingDOM = document.querySelectorAll(selectorForExisting);

  if (newDOM && existingDOM) {
    executeScripts(newDOM);

    existingDOM.forEach((element) => {
      element.outerHTML = newDOM.outerHTML;
    });
  }
}

function executeScripts(node) {
  const scripts = Array.from(node.querySelectorAll("script[src]")).map(
    ({ src, type }) => ({ src, type })
  );
  const uniqueScripts = scripts.filter(
    (script, index, self) =>
      index === self.findIndex((t) => t.src === script.src)
  );

  uniqueScripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.src = script.src;
    newScript.type = script.type;

    document.head.appendChild(newScript);
  });
}

function getDimissMessageDelay(text, options) {
  return Math.max(
    Math.min(text.length * 50, options.maxDelay),
    options.minDelay
  );
}

function createMessage(text, optionsOverrides = {}) {
  const options = deepMerge(
    WYATT.config.createMessage.options,
    optionsOverrides
  );
  const template = document.getElementById("message");
  const appendPoints = document.querySelectorAll(options.appendPoint);

  appendPoints.forEach((appendPoint) => {
    const message = template.content.firstElementChild?.cloneNode(true);
    const textPlaceholder = message.querySelector("[data-text]");

    message.classList.add(`message--${options.type}`);

    textPlaceholder.innerHTML = text;

    appendPoint.appendChild(message);

    if (options.dismiss) {
      const delay = getDimissMessageDelay(text, options);

      setTimeout(() => {
        message.dismiss();
      }, delay);
    }
  });
}

function registerComponent(name, klass, options) {
  const exists = customElements.get(name);

  if (!exists) {
    customElements.define(name, klass, options);
  }
}

const scrollLock = {
  enable: () => {
    const body = document.querySelector("body");

    body.dataset.scrollPosition = window.scrollY;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${body.dataset.scrollPosition}px`;
    body.style.width = "100%";
  },
  disable: () => {
    const body = document.querySelector("body");

    body.style.removeProperty("overflow");
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("width");
    window.scrollTo({
      top: body.dataset.scrollPosition,
      left: 0,
      behavior: "instant",
    });
    body.dataset.scrollPosition = window.scrollY;
  },
};

const loading = {
  add: (element) => {
    const template = document.getElementById("loading");
    const loader = template.content.firstElementChild?.cloneNode(true);
    const id = `loading-${Math.random().toString(16).slice(2)}`;

    element.style.position = "relative";
    element.loaderID = id;
    loader.id = id;
    element.appendChild(loader);
  },
  remove: (element) => {
    const loader = element.querySelector(`#${element.loaderID}`);

    element.style.position = "revert";
    loader.remove();
  },
};

function setRecentView(type, data) {
  if (data === null) {
    return;
  }

  const recentViews = JSON.parse(localStorage.getItem("wyattRecentViews")) || {
    product: [],
    collection: [],
    page: [],
    article: [],
  };

  const viewExists = recentViews[type].some((item) => item.id === data?.id);

  if (!viewExists) {
    const view = {
      id: data.id,
      handle: data.handle,
      timestamp: Date.now(),
    };

    recentViews[type].unshift(view);

    localStorage.setItem("wyattRecentViews", JSON.stringify(recentViews));
  }
}

function triggerEvent(element, eventName) {
  const event = new CustomEvent(eventName);

  element.dispatchEvent(event);
}

export {
  deepMerge,
  debounce,
  asyncRequest,
  replaceDOM,
  executeScripts,
  createMessage,
  registerComponent,
  scrollLock,
  loading,
  setRecentView,
  triggerEvent,
};
