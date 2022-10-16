let nextCourseId = 0;
let courses = {};
let courseTooltipModules = [];

function registerCourseTooltipModule(getModuleHTML, priority) {
  registerTooltipModule(courseTooltipModules, getModuleHTML, priority);
}

function addCourseTooltip(course) {
  let tooltip = addTooltip(course, courses, courseTooltipModules);
  tooltip.classList.add('uwl-course-tooltip');
  return tooltip;
}

function showCourseTooltip(course) {
  showTooltip(course, courses, addCourseTooltip);
}

function onCourseMouseOver(e) {
  onTagMouseOver(e, showCourseTooltip);
}

function onCourseMouseOut(e) {
  onTagMouseOut(e, courses);
}

function initCourses() {
  initTags(courses, 'uwl-course', getCourseCodes, formatCourseCode, onCourseMouseOver, onCourseMouseOut);
}

onDOMChange(initCourses);
