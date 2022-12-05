const DOM_CHANGE_TIMEOUT = 1000;
const SUBJECTS = ['ACC', 'ACINTY', 'ACTSC', 'AE', 'AFM', 'AHS', 'AMATH', 'ANTH', 'APPLS', 'ARABIC', 'ARBUS', 'ARCH', 'ARTS', 'ASL', 'ASTRN', 'AVIA', 'BASE', 'BE', 'BET', 'BIOL', 'BLKST', 'BME', 'BUS', 'CC', 'CDNST', 'CFM', 'CHE', 'CHEM', 'CHINA', 'CI', 'CIVE', 'CLAS', 'CM', 'CMW', 'CO', 'COGSCI', 'COMM', 'COOP', 'CROAT', 'CS', 'CT', 'DAC', 'DATSC', 'DEI', 'DUTCH', 'EARTH', 'EASIA', 'ECDEV', 'ECE', 'ECON', 'EDMI', 'EMLS', 'ENBUS', 'ENGL', 'ENTR', 'ENVE', 'ENVS', 'ERS', 'FILM', 'FINE', 'FR', 'GBDA', 'GEMCC', 'GENE', 'GEOE', 'GEOG', 'GER', 'GERON', 'GGOV', 'GRK', 'GS', 'GSJ', 'HEALTH', 'HIST', 'HLTH', 'HRM', 'HRTS', 'HUMSC', 'INDENT', 'INDEV', 'INDG', 'INTEG', 'INTST', 'ITAL', 'ITALST', 'JAPAN', 'JS', 'KIN', 'KOREA', 'KPE', 'LAT', 'LS', 'MATBUS', 'MATH', 'ME', 'MEDVL', 'MENN', 'MGMT', 'MISC', 'MNS', 'MOHAWK', 'MSCI', 'MTE', 'MTHEL', 'MUSIC', 'NANO', 'NE', 'OPTOM', 'PACS', 'PD', 'PDARCH', 'PDPHRM', 'PHARM', 'PHIL', 'PHYS', 'PLAN', 'PLCG', 'PMATH', 'PORT', 'PS', 'PSCI', 'PSYCH', 'QIC', 'REC', 'REES', 'RELC', 'RS', 'RSCH', 'RUSS', 'SCBUS', 'SCI', 'SDS', 'SE', 'SEQ', 'SFM', 'SI', 'SMF', 'SOC', 'SOCWK', 'SPAN', 'SPCOM', 'STAT', 'STV', 'SUSM', 'SVENT', 'SWK', 'SWREN', 'SYDE', 'TAX', 'THPERF', 'TN', 'TPM', 'TS', 'UN', 'UNDC', 'UNIV', 'UU', 'UX', 'VCULT', 'WATER', 'WHMIS', 'WKRPT', 'WS', 'YC'];
const COURSE_CODE_REGEXES = SUBJECTS.map(subject => new RegExp(`(?<=( |,|/|^))${subject} *([0-9]|[0-9][0-9][0-9]?[A-Za-z]?)(?=( |\\.|\\?|!|,|/|$))`, 'ig'));

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function eventHappenedDuringInterval(elem, eventStr, ms) {
  let eventHappened = false;
  if (elem) {
    const onEvent = () => {
      elem.removeEventListener(eventStr, onEvent);
      eventHappened = true;
    };
    elem.addEventListener(eventStr, onEvent);
  }

  return delay(ms).then(() => {
    return eventHappened;
  });
}

function onDOMChange(callback) {
  let observer = new MutationObserver(() => { onMutation(); });

  function onMutation() {
    observer.disconnect();  // Prevent infinite loop
    callback();

    // If another mutation is observed during timespan, call onMutation() again after
    let DOMChanged = false;
    let tempObserver = new MutationObserver(() => { DOMChanged = true; });
    tempObserver.observe(document, { subtree: true, childList: true, characterData: true });

    delay(DOM_CHANGE_TIMEOUT).then(() => {
      tempObserver.disconnect();
      if (DOMChanged) {
        onMutation();
      } else {
        observer.observe(document, { subtree: true, childList: true, characterData: true });
      }
    });
  }

  callback();
  observer.observe(document, { subtree: true, childList: true, characterData: true });
}

// Find and return course codes contained in string
function getCourseCodes(str) {
  let courseCodes = [];
  COURSE_CODE_REGEXES.forEach(regex => {
    courseCodes = courseCodes.concat(str.match(regex) ?? []);
  });
  return courseCodes;
}

// Format course code to 'XXX 123' format
function formatCourseCode(courseCode) {
  courseCode = courseCode.trim().toUpperCase();

  while (true) {
    const oldCourseCode = courseCode;
    courseCode = courseCode.replace('  ', ' ');
    if (oldCourseCode === courseCode) {
      break;
    }
  }

  const index = courseCode.search(/[0-9]/);
  if (courseCode[index - 1] === ' ') {
    return courseCode;
  }
  return courseCode.substring(0, index) + ' ' + courseCode.substring(index);
}

// Format course code to 'xxx123' format
function formatCourseCodeLower(courseCode) {
  return formatCourseCode(courseCode).replace(' ', '').toLowerCase();
}

const getUrl = {
  uwaterlooUcalendar: courseCode => {
    return `https://ucalendar.uwaterloo.ca/2223/COURSE/course-${courseCode.split(' ')[0]}.html#${courseCode.replace(' ', '')}`;
  },
  uwaterlooOutline: courseCode => {
    return `https://outline.uwaterloo.ca/browse/search/?q=${courseCode.replace(' ', '+')}&term=`;
  },
  uwflow: courseCode => {
    return `https://uwflow.com/course/${courseCode.replace(' ', '')}`;
  },
  reddit: courseCode => {
    return `https://www.reddit.com/r/uwaterloo/search/?q=&#34;${courseCode.replace(' ', '')}&#34;%20OR%20&#34;${courseCode.replace(' ', '%20')}&#34;&restrict_sr=on&include_over_18=on&sort=relevance&t=all`;
  }
};

function fetchUwflowCourse(courseCode) {
  return fetch('https://uwflow.com/graphql', {
    method: 'POST',
    body: JSON.stringify(
      {
        'operationName': 'getCourse',
        'variables': { 'code': formatCourseCodeLower(courseCode) },
        'query':
          `query getCourse($code: String) {
            course(where: {code: {_eq: $code}}) {
              ...CourseInfo
              ...CourseRequirements
              ...CourseRating
            }
          }
          fragment CourseInfo on course {
            id
            code
            name
            description
          }
          fragment CourseRequirements on course {
            id
            antireqs
            prereqs
            coreqs
          }
          fragment CourseRating on course {
            id
            rating {
              liked
              easy
              useful
              filled_count
            }
          }`
      }
    )
  }).then(response => response.json()).then(data => {
    data = data.data.course[0];
    return {
      courseCode: data.code,
      name: data.name,
      description: data.description,
      prereqs: data.prereqs,
      coreqs: data.coreqs,
      antireqs: data.antireqs,
      liked: data.rating.liked,
      easy: data.rating.easy,
      useful: data.rating.useful,
      numRatings: data.rating.filled_count
    };
  });
}

function getLoaderSpinningHTML(size, classes = []) {
  return `<div class="loader-spinning ${classes.join(' ')}" style="--size: ${size};">
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div>`;
}

function getPieChartHTML(percentage, size, thickness, classes = [], innerHTML = '') {
  return `<div class="uwl-pie-chart ${classes.join(' ')}" style="--percentage: ${percentage}; --size: ${size}; --thickness: ${thickness};">
  <div class="uwl-chart-bg"></div>  
  <div class="uwl-chart-bar"></div>
    ${innerHTML}
  </div>`;
}

function getBarChartHTML(percentage, width, height, classes = [], innerHTML = '') {
  return `<div class="uwl-bar-chart ${classes.join(' ')}" style="--percentage: ${percentage}; --width: ${width}; --height: ${height};">
    <div class="uwl-chart-bar"></div>
    ${innerHTML}
  </div>`;
}

let mouseX;
let mouseY;
if (typeof document !== 'undefined') {
  function getMousePos(e) {
    mouseX = e.clientX + window.scrollX;
    mouseY = e.clientY + window.scrollY;
  }
  document.addEventListener('mousemove', getMousePos);
}
