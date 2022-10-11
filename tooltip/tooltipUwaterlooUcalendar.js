function getTooltipUwaterlooUcalendarModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-module uwl-tooltip-uwaterloo-ucalendar-module"
  >
    <div class="uwl-tooltip-module-footer">
      <img class="uwl-tooltip-module-footer-icon" src="${chrome.runtime.getURL("media/calendar-icon-32.png")}" alt="uwaterloo calendar icon" width="32" height="32">
      <a class="uwl-tooltip-module-footer-link" href="${getUrl.uwaterlooUcalendar(courseCode)}" target="_blank">Go to ucalendar.uwaterloo.ca</a>
    </div>
  </div>`;
}

addTooltipModule(getTooltipUwaterlooUcalendarModuleHTML, 2);
