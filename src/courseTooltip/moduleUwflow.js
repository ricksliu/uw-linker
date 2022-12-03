const COURSE_TOOLTIP_UWFLOW_BAR_WIDTH = '0.8rem';

function formatUwflowPercentage(percentage) {
  return `${Math.round(percentage * 100)}%`;
}

function getCourseTooltipUwflowModule(course) {
  const courseCode = course.dataset.uwlCode;
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ tooltipModule: 'uwflow', courseCode: courseCode }, response => {
      const pieChartInnerHTML = `<div class="uwl-heading uwl-bold uwl-liked-stat">${formatUwflowPercentage(response.liked)}</div><div class="uwl-caption uwl-liked-label">liked</div>`;
      resolve(`<div
        class="uwl-module uwl-uwflow-module"
      >
        <div class="uwl-section uwl-rating">
          ${getPieChartHTML(response.liked * 100, '7.5rem', COURSE_TOOLTIP_UWFLOW_BAR_WIDTH, ['uwl-uwflow-theme', 'uwl-liked'], pieChartInnerHTML)}
          <div class="uwl-easy-useful-container">
            <div class="uwl-easy-useful-label uwl-easy-label">Easy</div>
            <div class="uwl-easy-useful-wrapper uwl-easy-wrapper">
              ${getBarChartHTML(response.easy * 100, '100%', COURSE_TOOLTIP_UWFLOW_BAR_WIDTH, ['uwl-uwflow-theme', 'uwl-easy-useful', 'uwl-easy'])}
              <div class="uwl-bold uwl-easy-useful-stat uwl-easy-stat">${formatUwflowPercentage(response.easy)}</div>
            </div>
            <div class="uwl-easy-useful-label uwl-useful-label">Useful</div>
            <div class="uwl-easy-useful-wrapper uwl-useful-wrapper">
              ${getBarChartHTML(response.useful * 100, '100%', COURSE_TOOLTIP_UWFLOW_BAR_WIDTH, ['uwl-uwflow-theme', 'uwl-easy-useful', 'uwl-useful'])}
              <div class="uwl-bold uwl-easy-useful-stat uwl-useful-stat">${formatUwflowPercentage(response.useful)}</div>
            </div>
            <div class="uwl-caption uwl-num-ratings">${response.numRatings} ratings</div>
          </div>
        </div>
        <div class="uwl-section uwl-footer">
          <img class="uwl-icon" src="${chrome.runtime.getURL("assets/uwflow-icon-32.png")}" alt="uwflow icon" width="32" height="32">
          <a class="uwl-link" href="${getUrl.uwflow(courseCode)}" target="_blank">Go to UW Flow</a>
        </div>
      </div>`);
    });
  });
}

registerCourseTooltipModule(getCourseTooltipUwflowModule, 1);
