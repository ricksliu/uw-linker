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
