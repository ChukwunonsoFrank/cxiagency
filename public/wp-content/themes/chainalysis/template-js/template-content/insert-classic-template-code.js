export default function insertClassicTemplateCode() {
    // Injects classic template code into our React-based theme
    // Moves the footer as needed

    'use strict';

    const templateContent = document.querySelector('.template-content');

    // Are we on a template-content-enabled page? If not, exit out.
    if ( null === templateContent ) {
        return;
    }

    // This CSS hides the 'template-content' div on initial page load and then adds a class to display it after page load
    templateContent.classList.add('fade-in');

    // Top navigation section, should be present on every page.
    const headRoomWrapper = document.querySelector('.headroom-wrapper');

    // Move template content to right beneath the top nav header section
    if ( null !== headRoomWrapper ) {
        headRoomWrapper.after(templateContent);
    }
}