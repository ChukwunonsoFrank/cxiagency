document.addEventListener('DOMContentLoaded', () => {

	'use strict';

	// Modal toggle web component
	customElements.define('modal-toggle', class extends HTMLElement {

		/**
		 * Instantiate the component
		 */
		constructor () {

			// Inherit parent class properties
			super();

			// Set properties
			this.modal = document.querySelector(`[key="${this.getAttribute('target')}"]`);
			this.toggle = this.querySelector('button, a');

			// Make sure required elements exist
			if (!this.modal || !this.toggle) return;

			// Show button
			this.removeAttribute('hidden');

			// If toggle is a link, add proper role
			if (this.toggle.matches('a')) {
				this.toggle.setAttribute('role', 'button');
			}

			// Listen for events
			this.toggle.addEventListener('click', this);

		}

		/**
		 * Handle open events
		 * @param {Event} event The event object
		 */
		handleEvent (event) {
			event.preventDefault();
			if (!this.modal) return;
			this.modal.open(this.toggle);
		}

	});

	// Modal content web component
	customElements.define('modal-content', class extends HTMLElement {

		/**
		 * Instantiate the component
		 */
		constructor () {

			// Inherit parent class properties
			super();

			// Set properties
			this.isOpen = false;
			this.baseClass = this.getAttribute('modal-type') || 'modal';
			this.isSlideout = this.baseClass === 'slideout';
			this.toggle = null;

			// Setup the DOM
			this.setup();

		}

		/**
		 * Setup the web component
		 */
		setup () {

			// Add base class to parent
			this.classList.add(this.baseClass);

			// Create modal backdrop
			this.modal = document.createElement('div');
			this.modal.className = `${this.baseClass}__overlay`;
			this.modal.setAttribute('aria-modal', true);

			// Create modal dialog
			this.dialog = document.createElement('div');
			this.dialog.className = `${this.baseClass}__panel`;
			this.dialog.setAttribute('role', 'dialog');

			// If slideout, add wrapper panel
			this.wrapper = document.createElement('div');
			this.wrapper.className = `${this.baseClass}__content`;
			this.wrapper.append(...Array.from(this.childNodes));

			// Move content into new elements
			this.dialog.append(this.wrapper);
			this.modal.append(this.dialog);
			this.append(this.modal);

			// Make first heading focusable
			this.heading = this.dialog.querySelector('h2, h3, h4, h5, h6');
			if (this.heading) {
				this.heading.setAttribute('tabindex', -1);
				this.heading.setAttribute('autofocus', '');
			} else {
				this.heading = this.querySelector('[close-modal]');
			}

			// Define autoplayable element, if any
			this.autoplay = null;

			// Check for Vimeo videos
			this.playable = Array.from(this.querySelectorAll('[data-vimeo-url]')).map((video) => {

				// If there's no ID, generate one
				if (!video.id) {
					video.id = `vimeo-${crypto.randomUUID()}`;
				}

				// Create a new player object
				let player = new Vimeo.Player(video.id);

				// If it's an autoplay video, and not already defined, set this.autoplay
				if (!this.autoplay && video.hasAttribute('wc-autoplay')) {
					this.autoplay = player;
				}

				// Return the player
				return player;

			});

			// Add native <video> and <audio> elements
			this.playable.concat(Array.from(this.querySelectorAll('video, audio')));

			// Relocate component outside of #page
			document.body.querySelector('#page')?.after(this);

			// Listen for events
			this.modal.addEventListener('click', this);
			document.addEventListener('keydown', this);

		}

		/**
		 * Handle events on the custom element
		 * @param  {Event} event The event object
		 */
		handleEvent (event) {
			this[`on${event.type}`](event);
		}

		/**
		 * Handle click events
		 * @param  {Event} event The event object
		 */
		onclick (event) {

			// Only run if this modal is open
			if (!this.isOpen) return;

			// If the close button
			if (event.target.closest('[close-modal]')) {
				this.close();
			}

			// If the overlay but not inside the modal
			let content = this.isSlideout ? this.wrapper : this.dialog;
			if (event.target === content || content.contains(event.target)) return;
			this.close();

		}

		/**
		 * Handle keydown events
		 * @param  {Event} event The event object
		 */
		onkeydown (event) {

			// Only run if this modal is open and Escape key was pressed
			if (!this.isOpen || event.key !== 'Escape') return;

			// Close the modal
			this.close();

		}

		/**
		 * Disable background scrolling
		 */
		disableScroll () {

			// Remove scrollbars
			let docWidth = document.documentElement.clientWidth;
			let scrollWidth = Math.abs(window.innerWidth - docWidth);
			document.body.style.paddingRight = `${scrollWidth}px`;
			document.body.style.overflow = 'hidden';

			// Prevent focus on background elements
			document.body.querySelector('#page').setAttribute('inert', '');

		}

		/**
		 * Reenable background scrolling
		 * @return {[type]} [description]
		 */
		enableScroll () {
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
			document.body.querySelector('#page')?.removeAttribute('inert');
		}

		/**
		 * Play the autoplay element, if one is set
		 */
		play () {

			// If there's no autoplay element, do nothing
			if (!this.autoplay) return;

			// If not playable, do nothing
			if (!('play' in this.autoplay) || typeof this.autoplay.play !== 'function') return;

			// Otherwise, autoplay
			this.autoplay.play();

		}

		/**
		 * Pause any playable media
		 */
		pause () {

			// Loop through each playable media
			for (let media of this.playable) {

				// If pausable, pause
				if ('pause' in media && typeof media.pause === 'function') {
					media.pause();
					continue;
				}

				// Otherwise, if it's an iframe, reset [src]
				if (media.tagName.toLowerCase() === 'iframe') {
					media.src = media.src;
				}

			}

		}

		/**
		 * Open the modal
		 * @param {Element} toggle The element that toggled the modal open
		 */
		open (toggle) {

			// Set state
			this.isOpen = true;

			// Set toggle
			this.toggle = toggle;

			// Prevent background scrolling/focus
			this.disableScroll();

			// Open the modal
			this.modal.classList.add('is-active');
			setTimeout(() => {

				// Animate in the modal
				this.modal.classList.add('animate');
				this.dialog.classList.add('is-active');

				// Focus title
				this.heading?.focus();

				// Autoplay playable media
				this.play();

			}, 50);

		}

		/**
		 * Close the modal
		 */
		close () {

			// Set state
			this.isOpen = false;

			// Pause any playable media
			this.pause();

			// Animate out the dialog
			setTimeout(() => { this.dialog.classList.remove('is-active'); }, 50);
			setTimeout(() => { this.modal.classList.remove('animate'); }, 100);

			// Remove the backdrop and reactive the document
			setTimeout(() => {

				// Reenable scroll
				this.modal.classList.remove('is-active');
				this.enableScroll();

				// If there's a toggle, shift focus back to it
				if (this.toggle) {
					this.toggle.focus();
					this.toggle = null;
				}

			}, 200);

		}

	});

});