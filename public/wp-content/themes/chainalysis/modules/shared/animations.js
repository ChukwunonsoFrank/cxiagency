"use strict";
// Observe web component.
// If we intersect, add the animation class(es) to this.

// Extend the HTMLElement class to create the web component
class animatedElement extends HTMLElement {
	/**
	 * The class constructor object
	 */
	constructor() {
		// Always call super first in constructor
		super();

		if (
			window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
			window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
		) {
			// Disable CSS animations to respect browser preference.
			return;
		}

		// Check for a src. Otherwise, quit.
		const animationList = this.getAttribute("animation");
		if (null === animationList) {
			console.error("Animation player missing expected animation.");
			return;
		}

		const debuggingURL = new URL('https://www.chainalysis.com/blockchain-intelligence/window.location.href');
		const hasDebugParam = debuggingURL.searchParams.has("debug");
		const debugOption = debuggingURL.searchParams.get("debug");
		const debugModeOn = (hasDebugParam && "cssanimation" === debugOption);

		/**
		 * Run animation when visible
		 * @param {Object} entry Observer instance
		 */
		// Apply the animation when element is intersecting
		const visuallyHideElementPrepAnim = (entries, visuallyHideObserver) => {
			const entry = entries[0]; // First entry should be the only entry

			// Once the animation meets the intersection requirements...
			if (entry.isIntersecting) {
				// Add CSS class(es) based on the list of animations.
				if (debugModeOn) {
					console.debug("about to hide this:", this);
				}
				this.classList.add("invisible-for-animation");

				// Stop the observer because we've applied the animation and can now free up resources
				visuallyHideObserver.disconnect();

				const animObserver = new IntersectionObserver(
					animRun,
					// { rootMargin: '0px 0px 200% 0px' } // trigger callback when target is below viewport
					{ rootMargin: "0px 0px -32px 0px" } // trigger callback when target is at least slightly above viewport
				);

				animObserver.observe(this);
			}
		};

		/**
		 * Run animation when visible
		 * @param {Object} entry Observer instance
		 */
		// Apply the animation when element is intersecting
		const animRun = (entries, animObserver) => {
			const entry = entries[0]; // First entry should be the only entry

			// Once the animation meets the intersection requirements...
			if (entry.isIntersecting) {
				// Add CSS class(es) based on the list of animations.

				if (debugModeOn) {
					console.debug("about to unhide this:", this);
				}
				this.classList.remove("invisible-for-animation");

				if (debugModeOn) {
					console.debug("about to add animation to:", this);
				}
				this.classList.add(animationList);

				// Stop the observer because we've applied the animation and can now free up resources
				animObserver.disconnect();
			}
		};

		const visuallyHideObserver = new IntersectionObserver(
			visuallyHideElementPrepAnim,
			{ rootMargin: "0px 0px 200% 0px" } // Visually hide elements before they become visible
		);

		visuallyHideObserver.observe(this);
	}
}

// Define the new web component
if ("customElements" in window) {
	customElements.define("animated-element", animatedElement);
}
