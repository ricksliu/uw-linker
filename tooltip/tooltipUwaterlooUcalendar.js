function getTooltipUwaterlooUcalendarModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-uwaterloo-ucalendar-module"
  >
    ${courseCode}
  </div>`;
}

addTooltipModule(getTooltipUwaterlooUcalendarModuleHTML, 2);
