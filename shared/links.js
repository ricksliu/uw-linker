
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
      numRatings: data.rating.filled_count,
      found: true
    };
  });
}
