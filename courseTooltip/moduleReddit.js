function getCourseTooltipRedditModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    resolve(`<div
      class="uwl-module uwl-reddit-module"
    >
      <div class="uwl-section uwl-footer">
        <img class="uwl-icon" src="${chrome.runtime.getURL("res/reddit-icon-32.png")}" alt="reddit icon" width="32" height="32">
        <a class="uwl-link" href="${getUrl.reddit(courseCode)}" target="_blank">Search r/uwaterloo</a>
      </div>
    </div>`);
  });
}

registerCourseTooltipModule(getCourseTooltipRedditModule, 4);
