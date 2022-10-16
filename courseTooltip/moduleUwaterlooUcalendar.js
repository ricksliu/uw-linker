function getCourseTooltipUwaterlooUcalendarModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    resolve(`<div
      class="uwl-module uwl-uwaterloo-ucalendar-module"
    >
      <div class="uwl-section uwl-footer">
        <img class="uwl-icon" src="${chrome.runtime.getURL("res/calendar-icon-32.png")}" alt="uwaterloo calendar icon" width="32" height="32">
        <a class="uwl-link" href="${getUrl.uwaterlooUcalendar(courseCode)}" target="_blank">Go to ucalendar.uwaterloo.ca</a>
      </div>
    </div>`);
  });
}

registerCourseTooltipModule(getCourseTooltipUwaterlooUcalendarModule, 2);
