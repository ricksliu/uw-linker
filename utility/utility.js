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

// Get array of course codes in string
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

function toElem(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML= html;
  return wrapper.firstChild;
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
