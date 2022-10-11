function getTooltipRedditModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-module uwl-tooltip-header-module"
  >
    <img class="uwl-tooltip-header-module-icon" src="${chrome.runtime.getURL("media/uwl-icon-32.png")}" alt="uwlinker icon" width="32" height="32">
    <div class="uwl-tooltip-header-module-text">UWLinker</div>
  </div>`;
}

addTooltipModule(getTooltipRedditModuleHTML, 0);
