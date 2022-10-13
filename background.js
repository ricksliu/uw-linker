try {
  importScripts('./utility/utility.js');
  importScripts('./utility/links.js');
} catch (error) {
  console.error(error);
}

const DATA_TIME_LIMIT = 1000 * 60 * 60 * 24;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tooltipModule === 'uwflow') {
    const uwflowKey = `uwflow-${formatCourseCodeLower(request.courseCode)}`;
    chrome.storage.sync.get([uwflowKey], oldData => {
      if (oldData[uwflowKey] && oldData[uwflowKey].timestamp >= Date.now() - DATA_TIME_LIMIT) {
        sendResponse(oldData[uwflowKey]);
      } else {
        fetchUwflowCourse(request.courseCode).then(newData => {
          newData.timestamp = Date.now();
          chrome.storage.sync.set({ [uwflowKey]: newData }, () => {
            sendResponse(newData);
          });
        });
      }
    });
  }
  return true;
});
