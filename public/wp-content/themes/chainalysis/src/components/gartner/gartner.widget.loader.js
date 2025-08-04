'use strict';
(async function () {

  // Get script version number from 'ver' param, so that we can apply it later as we import other scripts
  // Need to save this value in order to persist and avoid this problem:
  // https://stackoverflow.com/questions/38769103/document-currentscript-is-null
  const ver = new URL(document.currentScript.html).searchParams.get('ver');

  // Import waitForElement function
  const { waitForElement } = await import( `../../helpers/waitForElement.js?ver=${ver}` );

  // Wait for the gartner widget container element to appear in the DOM
  const widgetElement = await waitForElement('.gartnerwidget');

  // If our widget element is missing a product name, exit out.
  if (undefined === widgetElement.dataset.product) {
    console.error('widgetElement.dataset.product expected but not found');
    return;
  }

  // We have a widget container and a product name, so run the widget logic
  const { generateWidget } = await import( `./gartner.widget.logic.js?ver=${ver}` );
  await generateWidget(widgetElement, widgetElement.dataset.product, ver);
})();
