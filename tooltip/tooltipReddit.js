function getTooltipRedditModuleHTML(courseCode) {
  return `<div
    class="uwl-tooltip-module uwl-tooltip-reddit-module"
  >
    <div class="uwl-tooltip-module-footer">
      <img class="uwl-tooltip-module-footer-icon" src="${chrome.runtime.getURL("media/reddit-icon-32.png")}" alt="reddit icon" width="32" height="32">
      <a class="uwl-tooltip-module-footer-link" href="${getUrl.reddit(courseCode)}" target="_blank">Search r/uwaterloo</a>
    </div>
  </div>`;
}

addTooltipModule(getTooltipRedditModuleHTML, 4);
