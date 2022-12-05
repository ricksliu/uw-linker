const SHOW_TOOLTIP_DELAY = 500;
const HIDE_TOOLTIP_DELAY = 500;

let nextTagId = 0;

// Insert promise generating function that returns HTML into modules, sorted by ascending priority
function registerTooltipModule(modules, getModuleHTML, priority) {
  for (let i = 0; i < modules.length; ++i) {
    if (priority < modules[i][1]) {
      modules.splice(i, 0, [getModuleHTML, priority]);
      return;
    }
  }
  modules.push([getModuleHTML, priority]);
  return modules;
}

// Helper function
function attachTooltipModules(tooltip, modules, tags) {
  modules.map(module => module[0]).forEach(getModuleHTML => {
    if (tooltip.hasChildNodes()) {
      tooltip.appendChild(document.createElement('hr'));
    }

    // Append temporary element, then replace it when getModuleHTML() resolves
    let module = document.createElement('div');
    module.classList.add('uwl-module', 'uwl-temp-module', `uwl-temp-${getModuleHTML.name}-module`);
    module.innerHTML = getLoaderSpinningHTML('1.6rem');
    tooltip.appendChild(module);

    getModuleHTML(tooltip).then(html => {
      module.innerHTML = html;
      module = module.firstChild;
    }).catch(html => {
      module.innerHTML = html;
      module = module.firstChild;
    }).finally(() => {
      Array.from(module.querySelectorAll('.uwl-pin-controller')).forEach(pinController => {
        pinController.addEventListener('click', () => {
          tooltip.classList.toggle('pinned');
        });
      });
    });
  });
}

function addTooltip(tag, tags, tooltipModules) {
  let tooltip = document.createElement('div');
  tooltip.classList.add('uwl-tooltip', 'hidden');
  for (const attribute in tag.dataset) {
    tooltip.dataset[attribute] = tag.dataset[attribute];
  }

  attachTooltipModules(tooltip, tooltipModules, tags);

  tooltip.addEventListener('mouseout', e => { onTooltipMouseOut(e, tags); });
  document.body.appendChild(tooltip);
  tags[tooltip.dataset.uwlId].tooltip = tooltip;

  return tooltip;
}

function showTooltip(tag, tags, addTooltip) {
  let tooltip = tags[tag.dataset.uwlId].tooltip;
  if (!tooltip) {
    tooltip = addTooltip(tag);
  }
  if (tooltip.classList.contains('pinned')) {
    return;
  }

  tooltip.style.left = `${mouseX}px`;
  tooltip.style.top = `${mouseY}px`;

  delay(1).then(() => {
    tooltip.classList.remove('hidden');
  });
}

// Helper function
function hideTooltip(tooltip) {
  if (tooltip.classList.contains('pinned')) {
    return;
  }
  tooltip.classList.add('hidden');
}

function onTagMouseOver(e, showTooltip) {
  let tag = e.target.closest('.uwl-tag');
  eventHappenedDuringInterval(tag, 'mouseout', SHOW_TOOLTIP_DELAY).then((eventHappened) => {
    if (!eventHappened) {
      showTooltip(tag);
    }
  });
}

// Helper function
function onTagTooltipMouseOut(tag, tooltip) {
  Promise.all([
    eventHappenedDuringInterval(tag, 'mouseover', HIDE_TOOLTIP_DELAY),
    eventHappenedDuringInterval(tooltip, 'mouseover', HIDE_TOOLTIP_DELAY)
  ]).then(eventsHappened => {
    if (!eventsHappened[0] && !eventsHappened[1]) {
      hideTooltip(tooltip);
    }
  });
}

function onTagMouseOut(e, tags) {
  let tag = e.target.closest('.uwl-tag');
  let tooltip = tags[tag.dataset.uwlId].tooltip;
  if (tooltip) {
    onTagTooltipMouseOut(tag, tooltip);
  }
}

// Helper function
function onTooltipMouseOut(e, tags) {
  let tooltip = e.target.closest('.uwl-tooltip');
  let tag = tags[tooltip.dataset.uwlId].tag;
  onTagTooltipMouseOut(tag, tooltip);
}

// Helper function
function getTagHTML(tagClass, tagCode, formatTagCode, tagId) {
  return `<span
    class="uwl-tag ${tagClass}"
    data-uwl-code="${formatTagCode(tagCode)}"
    data-uwl-id="${tagId}"
  >${tagCode}</span>`;
}

function initTags(tags, tagClass, getTagCodes, formatTagCode, onTagMouseOver, onTagMouseOut, notSelectors = []) {
  let selectors = `*:not(.${tagClass})`;
  notSelectors.forEach(selector => { selectors += `:not(${selector})`; });
  Array.from(document.querySelectorAll(selectors)).forEach(elem => {
    Array.from(elem.childNodes).filter(child => child.nodeType === 3).forEach(textNode => {  
      const tagCodes = [...new Set(getTagCodes(textNode.textContent))];
      if (tagCodes.length > 0) {
        let newText = textNode.textContent;
        tagCodes.forEach(tagCode => {
          newText = newText.replaceAll(tagCode, getTagHTML(tagClass, tagCode, formatTagCode, nextTagId++));
          const oldTagId = nextTagId - 1;
          while (true) {
            const oldText = newText;
            newText = newText.replace(`data-uwl-id="${oldTagId}"`, `data-uwl-id="${nextTagId++}"`);
            if (oldText == newText) {
              break;
            }
          }
        });

        // Cannot directly set textContent as it does not parse HTML 
        const fragment = document.createRange().createContextualFragment(newText);
        textNode.replaceWith(fragment);
      }
    });

    Array.from(elem.querySelectorAll(`:scope > .${tagClass}`)).forEach(tag => {
      if (!(tag.dataset.uwlId in tags)) {
        tags[tag.dataset.uwlId] = {
          tag: tag
        };
      }

      tag.removeEventListener('mouseover', onTagMouseOver);
      tag.removeEventListener('mouseout', onTagMouseOut);
      tag.addEventListener('mouseover', onTagMouseOver);
      tag.addEventListener('mouseout', onTagMouseOut);
    });
  });
}
