function getTooltipUwflowModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-module uwl-tooltip-uwflow-module"
  >
    <div class="uwl-tooltip-module-footer">
      <img class="uwl-tooltip-module-footer-icon" src="${chrome.runtime.getURL("media/uwflow-icon-32.png")}" alt="uwflow icon" width="32" height="32">
      <a class="uwl-tooltip-module-footer-link" href="${getUrl.uwflow(courseCode)}" target="_blank">Go to UW Flow</a>
    </div>
  </div>`;
}

addTooltipModule(getTooltipUwflowModuleHTML, 1);
