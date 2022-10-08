const ADD_TOOLTIP_DELAY = 500;
const REMOVE_TOOLTIP_DELAY = 500;

let nextId = 0;
let tooltips = {}

function addTooltip(markerElem) {
  let tooltipElem = document.createElement('div');
  tooltipElem.classList.add('uwl-tooltip');
  tooltipElem.classList.add('hidden');
  tooltipElem.dataset.uwlCourseCode = markerElem.dataset.uwlCourseCode;
  tooltipElem.dataset.uwlId = markerElem.dataset.uwlId;

  tooltipElem.style.left = `${mouseX}px`;
  tooltipElem.style.top = `${mouseY}px`;

  tooltipElem.addEventListener('mouseout', onTooltipMouseOut);

  document.body.appendChild(tooltipElem);
  tooltips[tooltipElem.dataset.uwlId].tooltipElem = tooltipElem;

  delay(1).then(() => {
    tooltipElem.classList.remove('hidden');
  });
}

function showTooltip(markerElem) {
  let tooltipElem = tooltips[markerElem.dataset.uwlId].tooltipElem;
  if (tooltipElem) {
    tooltipElem.classList.remove('hidden');
  } else {
    addTooltip(markerElem);
  }
}

function removeTooltip(tooltipElem) {
  delete tooltips[tooltipElem.dataset.uwlId].tooltipElem;
  tooltipElem.remove();
}

function hideTooltip(tooltipElem) {
  tooltipElem.classList.add('hidden');
}

function onMarkerMouseOver(e) {
  let markerElem = e.target;
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
  let markerElem = e.target;
  let tooltipElem = tooltips[markerElem.dataset.uwlId].tooltipElem;
  if (!tooltipElem) {
    return;
  }
  onMarkerTooltipMouseOut(markerElem, tooltipElem);
}

function onTooltipMouseOut(e) {
  let tooltipElem = e.target;
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
          newText = newText.replaceAll(
            courseCode,
            `<span
              class="uwl-tooltip-marker"
              data-uwl-course-code="${formatCourseCode(courseCode)}"
              data-uwl-id="${nextId++}"
            >
              ${courseCode}
            </span>`
          );
        });

        // Cannot directly set textContent as it does not parse HTML 
        const fragment = document.createRange().createContextualFragment(newText);
        textNode.replaceWith(fragment);
      }
    });

    Array.from(elem.querySelectorAll(':scope > .uwl-tooltip-marker')).forEach(markerElem => {
      if (!(markerElem.dataset.uwlId in tooltips)) {
        tooltips[markerElem.dataset.uwlId] = {
          markerElem: markerElem
        };
      }

      // Prevent multiple listeners being added
      markerElem.removeEventListener('mouseover', onMarkerMouseOver);
      markerElem.removeEventListener('mouseout', onMarkerMouseOut);

      markerElem.addEventListener('mouseover', onMarkerMouseOver);
      markerElem.addEventListener('mouseout', onMarkerMouseOut);
    });
  });
}

var observer = new MutationObserver(() => {
  observer.disconnect();  // Prevent infinite loop
  addTooltipMarkers();
  observeMutations();
});

function observeMutations() {
  observer.observe(document, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

addTooltipMarkers();
observeMutations();
