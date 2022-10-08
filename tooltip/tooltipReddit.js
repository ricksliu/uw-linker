function getTooltipRedditModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-reddit-module"
  >
    ${courseCode}
  </div>`;
}

addTooltipModule(getTooltipRedditModuleHTML, 4);
