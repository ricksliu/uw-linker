function getTooltipUwaterlooOutlineModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-uwaterloo-outline-module"
  >
    ${courseCode}
  </div>`;
}

addTooltipModule(getTooltipUwaterlooOutlineModuleHTML, 3);
