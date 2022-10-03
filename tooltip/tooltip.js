function addTooltips() {
  document.querySelectorAll('*:not(.uwl-tooltip-marker)').forEach(elem => {
    Array.from(elem.childNodes).filter(child => child.nodeType === 3).forEach(textNode => {      
      let courseCodes = [...new Set(getCourseCodes(textNode.textContent))];
      if (courseCodes.length > 0) {
        let newText = textNode.textContent;

        courseCodes.forEach(courseCode => {
          newText = newText.replaceAll(
            courseCode,
            `<span class="uwl-tooltip-marker" data-course-code="${formatCourseCode(courseCode)}">${courseCode}</span>`
          );
        });

        const fragment = document.createRange().createContextualFragment(newText);
        textNode.replaceWith(fragment);
      }
    });

    Array.from(elem.querySelectorAll(':scope > .uwl-tooltip-marker')).forEach(markerElem => {
      markerElem.removeEventListener('mouseover', onMarkerHover);
      markerElem.addEventListener('mouseover', onMarkerHover);
    });
  });
}

function onMarkerHover(event) {
  console.log(event.target.dataset.courseCode);
}

var observer = new MutationObserver(() => {
  observer.disconnect();  // Prevent infinite loop
  addTooltips();
  observe();
});

function observe() {
  observer.observe(document, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

addTooltips();
observe();