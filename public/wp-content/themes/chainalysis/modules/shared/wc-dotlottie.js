import { DotLottie } from '@lottiefiles/dotlottie-web';

// Extend the HTMLElement class to create the web component
class dotLottiePlayer extends HTMLElement {
	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Check for a src. Otherwise, quit.
		const src = this.getAttribute('src');
		if ( null === src ) {
			console.error("Lottie missing expected animation file.");
			return;
		}

		const debuggingURL = new URL(window.location.href);
		const hasDebugParam = debuggingURL.searchParams.has("debug");
		const debugOption = debuggingURL.searchParams.get("debug");
		const debugModeOn = (hasDebugParam && "lottie" === debugOption);

		// Check whether attributes are set and are anything but false.
		const loop = this.hasAttribute('loop') && this.getAttribute('loop') !== 'false';

		// Render HTML.
		// The <canvas> is a child element where dotLottie embeds its animation
		this.innerHTML = `<canvas src="${src}" aria-live="polite"></canvas>`;

		const canvas = this.querySelector('canvas'); // This is the container where Lottie loads the animation

		const dotLottieSettings = {
			autoplay: false,
			canvas: canvas,
			loop: loop,
			src: src,
			renderConfig: {
				autoResize: true,
				freezeOnOffscreen: false,
			},
			layout: {
				"align": [ 0.5, 0.5 ],	// default [ 0.5, 0.5 ] = center center
				"fit": "contain"		// Accepts "contain", "cover", "fill", "fit-width", "fit-height" and "none".
			} // https://github.com/LottieFiles/dotlottie-web/tree/main/packages/web#layout
		};

		/**
		 * Lazy play or lazy stop the animation
		 * @param {Object} entry Observer instance
		 */
		const observerPlayer = (entries) => {
			const entry = entries[0]; // First entry should be the only entry
			if (debugModeOn) {
				console.debug("observerPlayer() entry:", entry);
			}

			if (entry.isIntersecting) {
				// If animation is not playing, then play it.
				if (debugModeOn) {
					console.debug("entry intersecting, play: ", src);
					console.debug("anim to play, is it playing?:", this.dotLottie.isPlaying, src);
				}

				if ( this.dotLottie.isPlaying !== true ) {
					this.dotLottie.play();
					if (debugModeOn) {
						console.debug("now isPlaying:", this.dotLottie.isPlaying, src);
						console.debug("now isPaused:", this.dotLottie.isPaused, src);
					}
				}
			} else {
				// Animation is not intersecting,
				// If animation is playing, then stop it.
				if (debugModeOn) {
					console.debug("not intersecting, pause:", src);
					console.debug("anim to pause, is it playing?:", this.dotLottie.isPlaying, src);
				}

				if ( this.dotLottie.isPlaying === true ) {
					this.dotLottie.pause(); // pauses animation
					if (debugModeOn) {
						console.debug("now isPlaying:", this.dotLottie.isPlaying, src);
						console.debug("now isPaused:", this.dotLottie.isPaused, src);
					}
				}
			}
		}

		// Lazy load the animation if it's intersecting
		const animLazyLoad = (entries, lazyLoadObserver) => {
			const entry = entries[0]; // First entry should be the only entry
			if (debugModeOn) {
				console.debug("animLazyLoad() entry:", entry.target);
			}

			if (entry.isIntersecting) {
				if (debugModeOn) {
					console.debug("intersecting animLazyLoad():", entry.target);
				}

				// Define and load the animation.
				this.dotLottie = new DotLottie(dotLottieSettings);
				// console.debug("This should be the only instance of this animation:", this.dotLottie);

				this.dotLottie.addEventListener("load", (event) => {

					this.dotLottie.pause();
					// Animation has loaded

					lazyLoadObserver.disconnect(); // stop the lazy load observer because we've lazy-loaded and can now free up resources

					// Update the dotLottie canvas to the correct aspect ratio.
					const adjustCanvasSizing = () => {

						if ( ! this.dotLottie ) {
							console.debug('missing this.dotLottie during adjustCanvasSizing:', this.dotLottie);
							return;
						}

						// Resize the dotLottie canvas after the animation loads
						const animationSize = this.dotLottie.animationSize();
						if ( null === animationSize ) {
							console.error("Expected animation sizing, but got null.");
							return;
						}

						const animDimensionsRatio = animationSize.width / animationSize.height;
						canvas.style.aspectRatio = animDimensionsRatio;
						if (debugModeOn) {
							console.debug("animDimensionsRatio:", animDimensionsRatio);
							console.debug("canvas.style.aspectRatio:", canvas.style.aspectRatio);
						}
					}
					adjustCanvasSizing();

					const lazyPlayToggleObserver = new IntersectionObserver( observerPlayer,
						{ // trigger callback when:
							root: null,
							rootMargin: '0px 0px 0px 0px', // target # px beneath bottom of viewport;
							threshold: 0.25, // Set to % visible of target * 100, e.g. 0 = 0%, 0.5 = 50%, 1 = 100%
						}
					);
					lazyPlayToggleObserver.observe(canvas);
				});
			}
		}

		const lazyLoadObserver = new IntersectionObserver( animLazyLoad,
			{ rootMargin: '0px 0px 200% 0px' } // trigger callback when target is below viewport
		);
		lazyLoadObserver.observe(canvas);

		// console.log("lazyLoadObserver:", lazyLoadObserver);
		// console.log("lazyLoadObserver target canvas:", canvas);
	}
}

// Define the new web component
if ('customElements' in window) {
	customElements.define('dot-lottie', dotLottiePlayer);
}
