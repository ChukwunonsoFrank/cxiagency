import insertClassicTemplateCode from './insert-classic-template-code.js';
import handleCustomersSelector from './select2-implementation.js';
import handleDemoSlideout from './demo-slideout.js';
('use strict');

document.addEventListener('DOMContentLoaded', () => {
	// Adding a little buffer time so certain 'page' div elements can be appended into 'template-content' div, otherwise will return invalid without adding buffer
	setTimeout(() => {
		// customer selector
		handleCustomersSelector();

		// handle any demo slideouts such as on solutions pages
		handleDemoSlideout();

		// Injects classic template code into our React-based theme
		insertClassicTemplateCode();

	}, 50);
});
