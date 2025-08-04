// import {Swiper} from 'swiper-bundle';

// Extend the HTMLElement class to create the web component
class swiperCarousel extends HTMLElement {
	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Chec that Swiper exists and is a function. Or else quit.
		if ( null === Swiper || 'function' !== typeof(Swiper)) {
			console.error('Missing expected Swiper functions.')
			return;
		};

		const swiperWrapper = this.querySelector('.swiper-wrapper');
		const autoplayType = this.getAttribute("autoplay");
		const autoplaySettings = new Object(); // prepare for possible autoplay-related settings

		const isAutoplayEnabled = (null !== autoplayType && "" !== autoplayType);	
		if (isAutoplayEnabled && "logos-default" === autoplayType) {
			autoplaySettings.speed = 10000;
			autoplaySettings.autoplay = { delay: 100 };
		}

		const navigationSettings = new Object();
		if (!isAutoplayEnabled) { // Show navigation only when autoplay is 
			navigationSettings.navigation = {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			};
		}

		const maxColumnsPerRow = new Object();
		maxColumnsPerRow.input = swiperWrapper?.style.getPropertyValue('--max-columns-per-row');
		maxColumnsPerRow.computed = ("" === maxColumnsPerRow.input) ? 1 : maxColumnsPerRow.input; // default to one column max, which is the default for Swiper

		/**
		 * Bugfix for Swiper A11Y issues
		 * @temp Remove once proper fix patched in Swiper core
		 * @link https://github.com/nolimits4web/swiper/issues/3149#issuecomment-715482955
		 * @return {[type]} [description]
		 */
		const makeAllButCurrentSlideInert = function makeAllButCurrentSlideInert() {
			this.slides.forEach((slide, index) => {
			if (index >= this.activeIndex && index < (this.activeIndex + this.loopedSlides)) {
				slide.removeAttribute('inert');
			} else {
				slide.setAttribute('inert', '');
			}
			});
		};

		const a11yOptions = {
			init() {
				makeAllButCurrentSlideInert.call(this);
				this.wrapperEl.setAttribute('aria-live', 'polite');
			},
			slideChange() {
				makeAllButCurrentSlideInert.call(this);
			}
		};

		// Instantiate a Swiper instance
		const swiper = new Swiper(this, {
			// Optional parameters
			loop: true,
			spaceBetween: 20, // only matters on viewports where we show multiple slides
			...(autoplaySettings),
			// watchOverflow: true, // set true by default. "Locks" the nav buttons if not enough slides for a given breakpoint

			breakpoints: {
				// when window width is >=
				767: { // should be same as $breakpoint-md
					spaceBetween: 32,
					slidesPerView: maxColumnsPerRow.computed,
				}
			},

			// Navigation arrows
			...(navigationSettings),
			// navigation: {
			//   nextEl: '.swiper-button-next',
			//   prevEl: '.swiper-button-prev',
			// },

			// @temp A11Y Fixes
			// on: a11yOptions
		});
	}
}

// Define the new web component
if ('customElements' in window) {
	customElements.define('swiper-carousel', swiperCarousel);
}