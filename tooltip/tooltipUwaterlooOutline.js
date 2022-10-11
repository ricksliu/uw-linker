function getTooltipUwaterlooOutlineModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-module uwl-tooltip-uwaterloo-outline-module"
  >
    <div class="uwl-tooltip-module-footer">
      <img class="uwl-tooltip-module-footer-icon" src="${chrome.runtime.getURL("media/spreadsheet-icon-32.png")}" alt="uwaterloo outline icon" width="32" height="32">
      <a class="uwl-tooltip-module-footer-link" href="${getUrl.uwaterlooOutline(courseCode)}" target="_blank">Search outline.uwaterloo.ca</a>
    </div>
  </div>`;
}

addTooltipModule(getTooltipUwaterlooOutlineModuleHTML, 3);
