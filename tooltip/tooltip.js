const ADD_TOOLTIP_DELAY = 500;
const REMOVE_TOOLTIP_DELAY = 500;
const MUTATION_OBSERVER_DELAY = 1000;

let nextId = 0;
let tooltips = {};
let tooltipModules = [];

function getTooltipMarkerHTML(courseCode, id) {
  return `<span
    class="uwl-tooltip-marker"
    data-uwl-course-code="${formatCourseCode(courseCode)}"
    data-uwl-id="${id}"
  >
    ${courseCode}
  </span>`;
}

// Insert a new HTML generating function into tooltipModules, sorted by priority ascending
function addTooltipModule(tooltipModule, priority) {
  for (let i = 0; i < tooltipModules.length; ++i) {
    if (priority < tooltipModules[i][1]) {
      tooltipModules.splice(i, 0, [tooltipModule, priority]);
      return;
    }
  }
  tooltipModules.push([tooltipModule, priority]);
}

function getTooltipElemHTML(courseCode) {
  let html = '';
  tooltipModules.forEach(tooltipModule => {
    if (html) {
      html += '<hr />';
    }
    html += tooltipModule[0](courseCode);
  });
  return html;
}

function addTooltip(markerElem) {
  let tooltipElem = document.createElement('div');
  tooltipElem.classList.add('uwl-tooltip');
  tooltipElem.classList.add('hidden');
  tooltipElem.dataset.uwlCourseCode = markerElem.dataset.uwlCourseCode;
  tooltipElem.dataset.uwlId = markerElem.dataset.uwlId;
  tooltipElem.innerHTML = getTooltipElemHTML(markerElem.dataset.uwlCourseCode);

  tooltipElem.addEventListener('mouseout', onTooltipMouseOut);

  document.body.appendChild(tooltipElem);
  tooltips[tooltipElem.dataset.uwlId].tooltipElem = tooltipElem;

  return tooltipElem;
}

function showTooltip(markerElem) {
  let tooltipElem = tooltips[markerElem.dataset.uwlId].tooltipElem;
  if (!tooltipElem) {
    tooltipElem = addTooltip(markerElem);
  }

  tooltipElem.style.left = `${mouseX}px`;
  tooltipElem.style.top = `${mouseY}px`;
  delay(1).then(() => {
    tooltipElem.classList.remove('hidden');
  });
}

function removeTooltip(tooltipElem) {
  delete tooltips[tooltipElem.dataset.uwlId].tooltipElem;
  tooltipElem.remove();
}

function hideTooltip(tooltipElem) {
  tooltipElem.classList.add('hidden');
}

function onMarkerMouseOver(e) {
  let markerElem = e.target.closest('.uwl-tooltip-marker');
  eventHappenedDuringInterval(markerElem, 'mouseout', ADD_TOOLTIP_DELAY).then((eventHappened) => {
    if (eventHappened) {
      return;
    }
    showTooltip(markerElem);
  });
}

function onMarkerTooltipMouseOut(markerElem, tooltipElem) {
  Promise.all([
    eventHappenedDuringInterval(markerElem, 'mouseover', REMOVE_TOOLTIP_DELAY),
    eventHappenedDuringInterval(tooltipElem, 'mouseover', REMOVE_TOOLTIP_DELAY)
  ]).then(eventsHappened => {
    if (eventsHappened[0] || eventsHappened[1]) {
      return;
    }
    hideTooltip(tooltipElem);
  });
}

function onMarkerMouseOut(e) {
  let markerElem = e.target.closest('.uwl-tooltip-marker');
  let tooltipElem = tooltips[markerElem.dataset.uwlId].tooltipElem;
  if (!tooltipElem) {
    return;
  }
  onMarkerTooltipMouseOut(markerElem, tooltipElem);
}

function onTooltipMouseOut(e) {
  let tooltipElem = e.target.closest('.uwl-tooltip');
  let markerElem = tooltips[tooltipElem.dataset.uwlId].markerElem;
  onMarkerTooltipMouseOut(markerElem, tooltipElem);
}

function addTooltipMarkers() {
  document.querySelectorAll('*:not(.uwl-tooltip-marker)').forEach(elem => {
    Array.from(elem.childNodes).filter(child => child.nodeType === 3).forEach(textNode => {  
      const courseCodes = [...new Set(getCourseCodes(textNode.textContent))];
      if (courseCodes.length > 0) {
        let newText = textNode.textContent;

        courseCodes.forEach(courseCode => {
          newText = newText.replaceAll(courseCode, getTooltipMarkerHTML(courseCode, nextId++));
        });

        // Cannot directly set textContent as it does not parse HTML 
        const fragment = document.createRange().createContextualFragment(newText);
        textNode.replaceWith(fragment);
      }
    });

    Array.from(elem.querySelectorAll(':scope > .uwl-tooltip-marker')).forEach(markerElem => {
      if (!(markerElem.dataset.uwlId in tooltips)) {
        tooltips[markerElem.dataset.uwlId] = { markerElem: markerElem };
      }

      // Prevent multiple listeners being added
      markerElem.removeEventListener('mouseover', onMarkerMouseOver);
      markerElem.removeEventListener('mouseout', onMarkerMouseOut);

      markerElem.addEventListener('mouseover', onMarkerMouseOver);
      markerElem.addEventListener('mouseout', onMarkerMouseOut);
    });
  });
}

// Call addTooltipMarkers() on startup and DOM updates
function startObserving(observer) {
  observer.observe(document, { childList: true, characterData: true, subtree: true });
}

let permObserver = new MutationObserver(() => { handleMutation(); });

function handleMutation() {
  permObserver.disconnect();  // Prevent infinite loop
  addTooltipMarkers();

  let mutationHappened = false;
  let tempObserver = new MutationObserver(() => { mutationHappened = true; });
  startObserving(tempObserver);

  delay(MUTATION_OBSERVER_DELAY).then(() => {
    tempObserver.disconnect();
    if (mutationHappened) {
      handleMutation();
    } else {
      startObserving(permObserver);
    }
  });
}

addTooltipMarkers();
startObserving(permObserver);
