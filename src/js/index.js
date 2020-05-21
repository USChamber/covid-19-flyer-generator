document.getElementById("MainContact").addEventListener("keyup", function (ev) {
  var contact = ev.target.value;
  document.getElementById("ContactUs").innerHTML = contact;
});

var data = {
  ppe: {
    icon: "mask.png",
    alt: "Mask",
    header: "Personal Protective Equipment",
    bullets: [
      "Asking employees and customers to wear a mask covering their nose and mouth",
      "Using shields or barriers between customers and clerks at service counters",
      "Providing personal protective equipment for employees, including gloves",
    ],
  },
  screening: {
    icon: "thermometer.png",
    alt: "Thermometer",
    header: "Screening",
    bullets: [
      "Screening the health of our suppliers, employees, and customers",
      "Screening workers for fever (over 100.4 degrees), cough, or shortness of breath",
    ],
  },
  socialDistancing: {
    icon: "socialDistancing.png",
    alt: "People Social Distancing",
    header: "Social Distancing",
    bullets: [
      "Maintaining the six-foot physical distancing requirements for employees and patrons",
      "Operating business at a reduced occupancy",
      "Refraining from physical contact and limit shared tools or spaces",
      "Scheduling specific hours of operation for vulnerable populations",
    ],
  },
  cleaning: {
    icon: "cleaning.png",
    alt: "Spray Cleaner Bottle",
    header: "Cleaning",
    bullets: [
      "Disinfecting common areas regularly including high-touch surfaces",
      "Reducing store hours to increase cleaning",
      "Providing disinfectant and sanitation products for workers to clean their workspace and equipment",
    ],
  },
  hygiene: {
    icon: "hygiene.png",
    alt: "Hands Being Washed",
    header: "Hygiene",
    bullets: [
      "Making hand sanitizer, disinfecting wipes, or soap and water readily available to employees and customers",
      "Requiring hand washing and sanitation by employees",
      "Requiring use of dedicated gloves for employees",
    ],
  },
  stayHome: {
    icon: "stayHome.png",
    alt: "People Staying at Home",
    header: "Stay at Home",
    bullets: [
      "Implementing teleworking, virtual meetings, and staggered shifts where possible",
      "Encouraging high-risk individuals to stay home",
      "Requiring workers who exhibit symptoms or illness to stay home or seek medical attention",
    ],
  },
  curbsideService: {
    icon: "curbsideService.png",
    alt: "Shopping App on Mobile Device",
    header: "Curbside Service",
    bullets: [
      "Using technology solutions where possible to reduce person-to-person interaction",
      "Encouraging non-cash payments and suspend use of PIN pads when possible",
      "Using curbside, delivery, or pick-up services where practical",
    ],
  },
  travel: {
    icon: "travel.png",
    alt: "Travel Tickets",
    header: "Travel & Events",
    bullets: [
      "Limiting non-essential business travel",
      "Curtailing business travel to high-infection areas",
      "Discouraging large gatherings",
    ],
  },
  food: {
    icon: "food.png",
    alt: "Fast Food",
    header: "Food",
    bullets: [
      "Discontinuing use of salad bars, buffets, and self-service",
      "Using disposable menus, rolled silverware, and eliminate table presets",
      "Limiting reservations for large groups",
      "Keeping bar seating closed",
      "Allowing reservation-only and call-ahead seating",
    ],
  },
};

function init() {
  var collapsed = "";
  for (var cat in data) {
    // create the form
    var formEl = document.createElement("form");
    formEl.classList = `${cat} category-form ${collapsed}`;
    formEl.id = `${cat}_Form`;
    formEl.setAttribute("data-category-id", cat);
    formEl.addEventListener("submit", function (ev) {
      ev.preventDefault();
      handleTextInput(ev.target.dataset.categoryId);
    });
    var headerContainerEl = document.createElement("div");
    headerContainerEl.classList = "category-form-header";
    var iconEl = document.createElement("img");
    iconEl.src = "./img/icon/" + data[cat].icon;
    iconEl.alt = data[cat].alt;
    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.classList = "cursor-pointer";
    toggleBtn.innerHTML = `<i data-id="${formEl.id}" class="fa fa-chevron-down" aria-hidden="true"></i>`;
    toggleBtn.setAttribute("data-id", formEl.id);
    toggleBtn.addEventListener("click", function (ev) {
      toggleCategoryForm(ev);
    });
    var headerEl = document.createElement("h3");
    headerEl.innerHTML = data[cat].header;
    headerEl.classList = "cursor-pointer";
    headerEl.setAttribute("data-id", formEl.id);
    headerEl.addEventListener("click", function (ev) {
      toggleCategoryForm(ev);
    });
    headerContainerEl.append(iconEl);
    headerContainerEl.append(headerEl);
    headerContainerEl.append(toggleBtn);
    formEl.append(headerContainerEl);
    data[cat].bullets.forEach(function (bullet, index) {
      var bulletEl = document.createElement("label");
      var inputEl = document.createElement("input");
      inputEl.setAttribute("data-category-id", cat);
      inputEl.addEventListener("change", function (ev) {
        handleCheckbox(ev, `${ev.target.dataset.categoryId}_Items`);
      });
      inputEl.type = "checkbox";
      var spanEl = document.createElement("span");
      spanEl.id = `${cat}_${index}`;
      spanEl.innerHTML = bullet;
      bulletEl.append(inputEl);
      bulletEl.append(spanEl);
      formEl.append(bulletEl);
    });
    var blankOptionEl = document.createElement("div");
    blankOptionEl.classList = "form-block";
    var inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.placeholder = "Or write your own...";
    inputEl.setAttribute("maxLength", "130");
    var submitEl = document.createElement("input");
    submitEl.type = "submit";
    submitEl.value = "Add";
    blankOptionEl.append(inputEl);
    blankOptionEl.append(submitEl);
    formEl.append(blankOptionEl);
    document.getElementById("FormElements").append(formEl);

    // create the dropzone
    var dropzone = document.createElement("div");
    dropzone.classList = "dropzone";
    dropzone.id = `${cat}_Items`;
    var imgContainer = document.createElement("div");
    imgContainer.classList = "img-container";
    imgContainer.addEventListener("mouseenter", function (ev) {
      ev.target.classList.add("hover");
    });
    imgContainer.addEventListener("mouseleave", function (ev) {
      ev.target.classList.remove("hover");
    });
    var itemList = document.createElement("ul");
    itemList.classList = "item-list";
    // add buttons
    var moveUpBtn = document.createElement("button");
    moveUpBtn.innerHTML = `<i class="fa fa-arrow-up" aria-hidden="true"></i><span>Move Up</span>`;
    moveUpBtn.classList = "move-up";
    moveUpBtn.setAttribute("data-id", dropzone.id);
    moveUpBtn.onclick = function () {
      var id = this.dataset.id;
      moveEl(id, "up");
      updateStyling();
    };
    var moveDownBtn = document.createElement("button");
    moveDownBtn.innerHTML = `<i class="fa fa-arrow-down" aria-hidden="true"></i><span>Move Down</span>`;
    moveDownBtn.classList = "move-down";
    moveDownBtn.setAttribute("data-id", dropzone.id);
    moveDownBtn.onclick = function () {
      var id = this.dataset.id;
      moveEl(id, "down");
      updateStyling();
    };
    dropzone.append(imgContainer);
    imgContainer.append(moveUpBtn);
    imgContainer.append(moveDownBtn);
    dropzone.append(itemList);
    document.getElementById("BodyContent").append(dropzone);
    collapsed = "collapsed";
  }
}

document.getElementById("Logo").addEventListener("click", function () {
  document.getElementById("LogoUploadButton").click();
});

function toggleCategoryForm(ev) {
  console.log("ev.target", ev.target);
  document.getElementById(ev.target.dataset.id).classList.toggle("collapsed");
}

function handleCheckbox(ev, checklistId) {
  var span = ev.target.parentNode.querySelector("span");
  if (!span.id) return;
  if (ev.target.checked) {
    document.getElementById(span.id).style.textDecoration = "line-through";
    document.getElementById(span.id).style.fontStyle = "italic";
    addItemToOutput(span.innerHTML, checklistId, span.id);
  } else {
    var el = document.getElementById("Output_" + span.id);
    el.parentNode.removeChild(el);
    document.getElementById(span.id).style.textDecoration = "none";
    document.getElementById(span.id).style.fontStyle = "normal";
  }
  updateStyling();
}

function handleTextInput(categoryId) {
  var input = document.querySelector(`#${categoryId}_Form input[type="text"]`);
  addItemToOutput(input.value, `${categoryId}_Items`);
  input.value = "";
}

function loadImageFile(event) {
  document.getElementById("Logo").src = URL.createObjectURL(
    event.target.files[0]
  );
}

function addItemToOutput(text, parentId, sourceId) {
  var parentEl = document.getElementById(parentId);
  var id = sourceId || new Date().getTime();
  var item = document.createElement("li");
  item.id = "Output_" + id;
  item.classList = "dropzone-item";
  item.addEventListener("mouseenter", function (ev) {
    ev.target.classList.add("hover");
  });
  item.addEventListener("mouseleave", function (ev) {
    ev.target.classList.remove("hover");
  });
  var textEl = document.createElement("p");
  textEl.innerHTML = text;
  textEl.setAttribute("contenteditable", true);
  item.append(textEl);
  // Edit Text
  var editSpan = document.createElement("span");
  editSpan.innerHTML = "Click to edit the text";
  editSpan.classList = "hover-text";
  item.append(editSpan);
  // remove button
  var removeBtn = document.createElement("button");
  removeBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i><span>Remove</span>`;
  removeBtn.setAttribute("data-id", item.id);
  removeBtn.setAttribute("data-source-id", sourceId);
  removeBtn.addEventListener("mouseenter", function (ev) {
    ev.target.parentNode.classList.add("delete-hover");
  });
  removeBtn.addEventListener("mouseleave", function (ev) {
    ev.target.parentNode.classList.remove("delete-hover");
  });
  removeBtn.onclick = function () {
    var id = this.dataset.id;
    var sourceId = this.dataset.sourceId;
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
    if (sourceId && sourceId !== "undefined") {
      document.getElementById(sourceId).style.textDecoration = "none";
      document.getElementById(sourceId).style.fontStyle = "normal";
      document
        .getElementById(sourceId)
        .parentNode.querySelector("input").checked = false;
    }
    updateStyling();
  };
  item.append(removeBtn);
  parentEl.querySelector(".item-list").append(item);
  updateStyling();
}

function moveEl(id, direction) {
  var dzItems = document.getElementsByClassName("dropzone");
  var currentIndex = null;
  var pathToNeighbor = 0;
  for (var i = 0; i < dzItems.length; i++) {
    if (dzItems[i].id == id) {
      currentIndex = i;
    }
  }
  do {
    if (direction === "up") pathToNeighbor--;
    else pathToNeighbor++;
    if (!dzItems[currentIndex + pathToNeighbor]) return;
  } while (
    !dzItems[currentIndex + pathToNeighbor].classList.contains("active")
  );

  if (direction === "up")
    dzItems[currentIndex + pathToNeighbor].before(dzItems[currentIndex]);
  else dzItems[currentIndex + pathToNeighbor].after(dzItems[currentIndex]);
}

function updateStyling() {
  var totalActiveCats = 0;
  for (var cat in data) {
    var parentEl = document.getElementById(`${cat}_Items`);
    var items = parentEl.querySelectorAll(".dropzone-item");
    var active = items.length >= 1;
    var existingIcon = document.querySelector(`#${cat}_Items .output-icon`);
    if (active) {
      totalActiveCats++;
      parentEl.classList.add("active");
      if (!existingIcon) {
        var icon = document.createElement("img");
        icon.src = "./img/icon/" + data[cat].icon;
        icon.alt = data[cat].alt;
        icon.classList = "output-icon";
        parentEl.querySelector(".img-container").prepend(icon);
      }
    } else {
      parentEl.classList.remove("active");
      if (existingIcon) {
        existingIcon.parentNode.removeChild(existingIcon);
      }
    }
  }
  adjustFontSize();
  if (totalActiveCats > 4) {
    document.getElementById("BodyContent").classList.add("flex");
  } else {
    document.getElementById("BodyContent").classList.remove("flex");
  }
}

function adjustFontSize(direction, amount) {
  document.getElementById("BodyContent").style.visibility = "hidden";
  window.setTimeout(function () {
    if (!amount) amount = 10;
    var specificity = 0.1;
    if (!direction) direction = "none";
    var bodyEl = document.getElementById("BodyContent");
    var targetHeight = document.getElementById("Body").getBoundingClientRect()
      .height;
    var maxWidth = 670;
    var height = bodyEl.getBoundingClientRect().height;
    var width = bodyEl.getBoundingClientRect().width;
    var fontSize = Number(bodyEl.style.fontSize.split("px")[0]);
    amount = amount * 0.8;
    if (height > targetHeight || width > maxWidth) {
      var newFontSize = `${fontSize - amount}px`;
      document.getElementById("BodyContent").style.fontSize = newFontSize;
      if (amount > specificity) {
        return adjustFontSize("decrease", amount);
      }
    } else if (height <= targetHeight) {
      var newFontSize = `${fontSize + amount}px`;
      document.getElementById("BodyContent").style.fontSize = newFontSize;
      //   if (amount > specificity) {
      return adjustFontSize("increase", amount);
      //   }
    }
    document.getElementById("BodyContent").style.visibility = "";
    return;
  }, 50);
}

function handlePrint() {
  window.print();
  return false;
}

function handleReset() {
  window.location.href = window.location.href;
}

// track printing using dialogue
if (window.matchMedia) {
  var mediaQueryList = window.matchMedia("print");
  mediaQueryList.addListener(function (mql) {
    if (!mql.matches) {
      trackPrint();
    }
  });
}

function trackPrint() {
  if (!gtag) return;
  gtag("event", "print", {
    event_category: "Interaction",
  });
}

var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf("safari") != -1) {
  if (ua.indexOf("chrome") > -1) {
    // alert("1"); // Chrome
  } else {
    document.getElementById("Body").style.height = "470px";
  }
}

init();
