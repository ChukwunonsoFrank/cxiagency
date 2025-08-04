export default function handleDemoSlideout() {
	'use strict';
	// Look for a bookdemo / slideout trigger button, probably in the solution template.
	// At some point we might wantto change this to a more modular component.
	const slideoutButtons = document.querySelectorAll('.button--bookdemo');

	if (0 === slideoutButtons.length) {
		// If we don't find a bookdemo button, exit out
		return;
	}

	const slideoutContainer = document.querySelector('.slideout-container');

	// If we don't find a slideout form even though there's a CTA button, then throw an warning and exit.
	if (null === slideoutContainer) {
		console.warn(
			`There's a slideout button but no slideout container. This might not end well. Aborting.`
		);
		return;
	}

	// At the moment we only support one unique slideout per page even if there are multiple CTA buttons that open it.
	// This is why we use a simple querySelector here instead of querySelectorAll
	const slideoutFormClose = slideoutContainer.querySelector(
		'.slideout-container .close-icon'
	);

	const slideoutFormOverlay = slideoutContainer.querySelector(
		'.slideout-translucent-background'
	); // overlay located in .bookdemo

	if (slideoutButtons) {
		document.addEventListener('click', (event) => {
			if (!event.target.classList.contains('button--bookdemo')) {
				return;
			}
			event.preventDefault();
			document.body.classList.add('disableModalScroll');
			slideoutContainer.style.transform = 'translateX(0%)';
			slideoutFormOverlay.style.opacity = 1;
			slideoutFormOverlay.style.pointerEvents = 'all';
		});
	}

	if (slideoutFormClose) {
		slideoutFormClose.addEventListener('click', (event) => {
			document.body.classList.remove('disableModalScroll');
			slideoutContainer.style.transform = 'translateX(130%)';
			slideoutFormOverlay.style.opacity = 0;
			slideoutFormOverlay.style.pointerEvents = 'none';
		});
	}

	if (slideoutFormOverlay) {
		slideoutFormOverlay.addEventListener('click', () => {
			document.body.classList.remove('disableModalScroll');
			slideoutContainer.style.transform = 'translateX(130%)';
			slideoutFormOverlay.style.opacity = 0;
			slideoutFormOverlay.style.pointerEvents = 'none';
		});
	}
}
