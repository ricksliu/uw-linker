function getTooltipUwflowModuleHTML(courseCode) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ tooltipModule: 'uwflow', courseCode: courseCode }, response => {
      resolve(`<div
        class="uwl-tooltip-module uwl-tooltip-uwflow-module"
      >
      <div class="uwl-tooltip-module-header">
        <div class="uwl-tooltip-module-course-code">${response.courseCode}</div>
        <div class="uwl-tooltip-module-name">${response.name}</div>
        <div class="uwl-tooltip-module-description">${response.description}</div>
      </div>
        <div class="uwl-tooltip-module-rating">
          <div class="uwl-tooltip-module-liked">${response.liked}% liked</div>
          <div class="uwl-tooltip-module-easy">${response.easy}% easy</div>
          <div class="uwl-tooltip-module-useful">${response.useful}% useful</div>
        </div>
        <div class="uwl-tooltip-module-footer">
          <img class="uwl-tooltip-module-footer-icon" src="${chrome.runtime.getURL("media/uwflow-icon-32.png")}" alt="uwflow icon" width="32" height="32">
          <a class="uwl-tooltip-module-footer-link" href="${getUrl.uwflow(courseCode)}" target="_blank">Go to UW Flow</a>
        </div>
      </div>`);
    });
  });
}

addTooltipModule(getTooltipUwflowModuleHTML, 1);
