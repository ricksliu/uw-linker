function getCourseTooltipInfoModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ tooltipModule: 'uwflow', courseCode: courseCode }, response => {
      resolve(`<div
        class="uwl-module uwl-info-module"
      >
        <div class="uwl-section uwl-name-course-code">
          <div class="uwl-heading uwl-course-code">${courseCode}</div>
          <div class="uwl-vr"></div>
          <div class="uwl-name">${response.name}</div>
        </div>
        <div class="uwl-section uwl-caption uwl-description">${response.description}</div>
      </div>`);
    });
  });
}

registerCourseTooltipModule(getCourseTooltipInfoModule, 0);
