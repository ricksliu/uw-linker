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
