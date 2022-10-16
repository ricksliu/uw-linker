function getCourseTooltipUwaterlooOutlineModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    resolve(`<div
      class="uwl-module uwl-uwaterloo-outline-module"
    >
      <div class="uwl-section uwl-footer">
        <img class="uwl-icon" src="${chrome.runtime.getURL("res/spreadsheet-icon-32.png")}" alt="uwaterloo outline icon" width="32" height="32">
        <a class="uwl-link" href="${getUrl.uwaterlooOutline(courseCode)}" target="_blank">Search outline.uwaterloo.ca</a>
      </div>
    </div>`);
  });
}

registerCourseTooltipModule(getCourseTooltipUwaterlooOutlineModule, 3);
