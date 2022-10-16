function getCourseTooltipUwflowModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ tooltipModule: 'uwflow', courseCode: courseCode }, response => {
      resolve(`<div
        class="uwl-module uwl-uwflow-module"
      >
        <div class="uwl-section uwl-rating">
          <div class="uwl-liked">${response.liked}% liked</div>
          <div class="uwl-easy">${response.easy}% easy</div>
          <div class="uwl-useful">${response.useful}% useful</div>
        </div>
        <div class="uwl-section uwl-footer">
          <img class="uwl-icon" src="${chrome.runtime.getURL("res/uwflow-icon-32.png")}" alt="uwflow icon" width="32" height="32">
          <a class="uwl-link" href="${getUrl.uwflow(courseCode)}" target="_blank">Go to UW Flow</a>
        </div>
      </div>`);
    });
  });
}

registerCourseTooltipModule(getCourseTooltipUwflowModule, 1);
