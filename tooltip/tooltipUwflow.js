function getTooltipUwflowModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-uwflow-module"
  >
    ${courseCode}
  </div>`;
}

addTooltipModule(getTooltipUwflowModuleHTML, 1);
