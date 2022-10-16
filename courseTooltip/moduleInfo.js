function getCourseTooltipInfoModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ tooltipModule: 'uwflow', courseCode: courseCode }, response => {
      resolve(`<div
        class="uwl-module uwl-info-module"
      >
        <div class="uwl-section uwl-info">
          <div class="uwl-course-code">${response.courseCode}</div>
          <div class="uwl-name">${response.name}</div>
          <div class="uwl-description">${response.description}</div>
        </div>
      </div>`);
    });
  });
}

registerCourseTooltipModule(getCourseTooltipInfoModule, 0);
