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
          <img class="uwl-icon uwl-pin-controller" src="${chrome.runtime.getURL("res/pin-icon-32.png")}" alt="pin icon" width="32" height="32">
        </div>
        <div class="uwl-section uwl-caption uwl-description">${response.description}</div>
        ${response.prereqs || response.coreqs || response.antireqs ? `<table class="uwl-section uwl-caption uwl-reqs">
          ${response.prereqs ? `<tr class="uwl-req">
            <td class="uwl-bold">Prereqs: </td>
            <td class="uwl-req-data">${response.prereqs}</td>
          </tr>` : ''}
          ${response.coreqs ? `<tr class="uwl-req">
            <td class="uwl-bold">Coreqs: </td>
            <td class="uwl-req-data">${response.coreqs}</td>
          </tr>` : ''}
          ${response.antireqs ? `<tr class="uwl-req">
            <td class="uwl-bold">Antireqs: </td>
            <td class="uwl-req-data">${response.antireqs}</td>
          </tr>` : ''}
        </table>` : ''}
      </div>`);
    });
  });
}

registerCourseTooltipModule(getCourseTooltipInfoModule, 0);
