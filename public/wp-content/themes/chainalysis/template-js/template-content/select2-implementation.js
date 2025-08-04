export default function handleCustomersSelector() {

    'use strict';

    if ( document.querySelector('.customers-select__select') === null ) {
        // Didn't find a customer selector, so exit out
        return;
    }

    // Lawrence changes begin here.
    $ = jQuery.noConflict();

    // Define the dropdown selector
    const customersSelector = $('.customers-select__select');

    // Check whether our customer tag selector exists on the page
    if ( customersSelector.length ) {

        // Handle the tag selector

        // Applies Select2 to this element, https://select2.org/getting-started/basic-usage
        customersSelector.select2();

        customersSelector.change(function() {
            let selectOption = $(this).val();
            let tagDividerChars = "%20";
            let tagsSearchString = tagDividerChars + selectOption + tagDividerChars;

            $('.customers-story__single').fadeOut(0);

            $('.customers-story__single').each( function() {
                // Get the string that contains all of the item's data-tags
                let itemTags = $(this).attr("data-tags");

                // if search value matches any of this item's tags
                if ( itemTags.toLowerCase().indexOf( tagsSearchString ) >= 0 ) {
                    // Then show the item because it matches.
                    $(this).fadeIn('fast');
                } else if ( selectOption === 'default' ) {
                    // If the visitor chooses the default "select an option", show everything.
                    $('.customers-story__single').fadeIn('fast');
                } else {
                    $(this).fadeOut('fast');
                }
            });
        });
    }
}