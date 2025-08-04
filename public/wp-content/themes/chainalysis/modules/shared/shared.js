// import "../../node_modules/headroom.js/dist/headroom.js";
// demo update 2024/08/28 10:57pm ET
'use strict';

document.addEventListener('DOMContentLoaded', () => {

let root = document.documentElement;
let topnavWrapper = document.querySelector('.topnav.headroom-wrapper');
let topnav = document.querySelector('.topnav.headroom-wrapper > .headroom');
if (!root || !topnavWrapper || !topnav ) return;

// calc topnav visible height
function setTopnavVisibleHeight(root, navWrapper, nav) {
    if (!root, !navWrapper || !nav) return;

    // unfixed = top of page, nav is visible
    // unpinned = scrolled down and nav no longer visible
    // pinned = scrolled up, nav is visible

    // The height is always the height, regardless of whether the top is visible
    root.style.setProperty('--topnav-total-height',navWrapper.style.height);

    if (nav.classList.contains('headroom--unfixed')) {
        // console.log('** unfixed topnav, visible, offset needed')
        root.style.setProperty('--topnav-visible-height',navWrapper.style.height);
    } else if (nav.classList.contains('headroom--unpinned')) {
        // console.log('** unpinned topnav, invisible, offset zero')
        root.style.setProperty('--topnav-visible-height','0px');
    } else {
        // otherwise the subnav offset is equal to the wrapper height
        // console.log('** pinned topnav, visible, offset needed')
        root.style.setProperty('--topnav-visible-height',navWrapper.style.height);
    }
}

/**
 * start mutation observer for top nav
 */

// Select the node that will be observed for mutations
const mutationTargetNode = topnav;

// Options for the observer (which mutations to observe)
const mutationConfig = { attributes: true, childList: false, subtree: true };

// Callback function to execute when mutations are observed
const mutationCallback = (mutationList, mutationObserver) => {
  for (const mutation of mutationList) {
    if (mutation.type === "attributes") {
        // console.log("mutationTargetNode.classList:",mutationTargetNode.classList);
        // console.log(`The ${mutation.attributeName} attribute was modified.`);
        setTopnavVisibleHeight(root, topnavWrapper, topnav);
    }
  }
};

// Create an mutation observer instance linked to the callback function
const mutationObserver = new MutationObserver(mutationCallback);

// Start observing the target node for configured mutations
mutationObserver.observe(mutationTargetNode, mutationConfig);

/**
 * end mutation observer for top nav
 */

/**
 * begin resize observer for top nav
 */

const resizeObserver = new ResizeObserver(() => {
    // console.log("*** resizeObserver");
    setTopnavVisibleHeight(root, topnavWrapper, topnav);
});
resizeObserver.observe(topnav); // This always runs at least once.

/**
 * end resize observer for top nav
 */

(function () {

    const jumplinksNav = document.querySelector('.jumplinks-nav');

    if ( null === jumplinksNav || 0 === jumplinksNav.length ) {
        // console.log('no jumplinksNav');
        return;
    }

    // Update target scrolling amount as needed to accomodate how the topnav will appear
    // On hover, before click, add or remove class to set scroll-margin-top for the target
    function adjustTargetScrolling(event) {
        // Exit if target is not a jumplink
        if ('a' !== event.target.localName || ! event.target.classList.contains("jumplink") ) {
            return;
        }

        let target = document.querySelector(event.target.hash);

        if ( undefined === target || null === target ) { return; }

        let targetTop = target.getBoundingClientRect().top;

        if ( undefined === targetTop || null === targetTop ) { return; }

        // Add or remove class to set scroll-margin-top
        if ( targetTop > 0 ) {
            // If top of target rect is > 0, then reduce scroll
            target.classList.add('scroll-less');
            // jumplinksNav.classList.add('scroll-more');
        } else {
            // Otherwise restore us to full scroll margin, which is the default
            target.classList.remove('scroll-less');
            // jumplinksNav.classList.remove('scroll-more');
        }

        // console.log('hashy:', event.target.hash, 'targetTop:',targetTop)
    }

    jumplinksNav.addEventListener("pointerover", (event) => {
        // console.log('event: pointerover');
        adjustTargetScrolling(event);
    });

})();

// Intersection Observer
(function () {

    const jumplinks = document.querySelectorAll('.jumplink');

    // Quit if we have no jumplinks.
    // It's a nodelist, then it won't be null or falsey if there are zero entries, so we have to test for the size of the nodelist.
    if ( null === jumplinks || 0 === jumplinks.length ) {
        return;
    }

    const options = {
		rootMargin: "-50% 0px", // halfway in viewport vertically / on Y axis
	};

	const callback = (entries) => {

        entries.forEach((entry) => {

            // console.log('observer callback:',entry.target.id, ', intersecting:', entry.isIntersecting);
            // console.log('observer callback entry:',entry);
            // console.log('----');

            if (entry.isIntersecting) {

                // Once we have an newly-intersecting element, then update the active vs inactive jumplink states
                // This way, we don't trigger unecesary changes when an intersection element no longer intersects.

                const jumplinks = document.querySelectorAll('.jumplink');

                jumplinks.forEach((jumplink) => {
                    // Based on the currently-intersecting section, calculate what the matching jumplink hash would be.
                    // For example, if "speed" is intersecting, then we'll make changes to jumplinks based on whether they have a hash of "#speed".
                    let intersectionTargetHash = '#' + entry.target.id;

                    if ( intersectionTargetHash === jumplink.hash ) {
                        // If jumplink is the current jumplink, add an active class
                        jumplink.classList.add('active');
                    } else {
                        // Otherwise remove the active class (if it's set).
                        jumplink.classList.remove('active');
                    }
                });
            } else {
                // console.log('not intersecting');
            }
		});
	};

    const observer = new IntersectionObserver(callback, options);

    jumplinks.forEach((jumplink) => {

        // Observe every jumplink that has a hash value.
        // We check for hash value in case somehow there's a .jumplink element with no href.
        if (jumplink.hash) {
            let target = document.querySelector(jumplink.hash);
            observer.observe(target);
        }
    });
})();


// We aren't using these emitted events at the moment because we need more complex rules for the subnav positioning, such as adjusting to resizes and the "unfixed" state
// Adjust subnav position when topnav gets pinned
// document.addEventListener('headroom:pin', (event) => {
    // let topnav = document.querySelector('.topnav.headroom-wrapper');
    // let subnav = document.querySelector('.top-subnav-wrapper');
    // if (!subnav || !topnav) return;
    // let height = topnav.style.height;
    // if (!height) return;
    // subnav.style.top = height;
// });

// Adjust subnav position when topnav gets unpinned
// document.addEventListener('headroom:unpin', (event) => {
    // let subnav = document.querySelector('.top-subnav-wrapper');
    // if (!subnav) return;
    // subnav.style.top = '';
// });


// JavaScript
customElements.define('chain-subnav', class extends HTMLElement {

    /**
     * The class constructor object
     */
    constructor () {

        // Always call super first in constructor
        super();

        // Define properties
        this.content = this.querySelector('ul, ol');
        this.btn = document.createElement('button');

        // Create expand/collapse icon
        this.btn.innerHTML = `<svg width="1em" height="0.625em" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15 1.5-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"/></svg>`;
        this.btn.setAttribute('aria-label', this.getAttribute('label') || 'Show Menu');
        this.btn.setAttribute('aria-expanded', false);
        this.btn.className = 'btn__subnav-toggle';
        this.prepend(this.btn);

        // Hide nav by default
        this.content.setAttribute('hidden', '');

        // Attach event listener
        this.btn.addEventListener('click', this);

    }

    /**
     * Handle events on the web component
     * @param  {Event} event The event object
     */
    handleEvent (event) {
        this.btn.setAttribute('aria-expanded', this.btn.getAttribute('aria-expanded') !== 'true');
        this.content.toggleAttribute('hidden', this.btn.getAttribute('aria-expanded') !== 'true');
    }

});

});