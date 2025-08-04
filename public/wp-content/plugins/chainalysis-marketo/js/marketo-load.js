"use strict";
(function () {
    //silly way of dealing with field duplications from multiple marketo initializations across the site
    function cleanMarketoDuplicates(form) {
        if (!form || !form.querySelectorAll) {
            //console.error('Invalid form element provided');
            return false;
        }

        // Get all relevant elements
        const allElements = Array.from(form.querySelectorAll(`
            input[name], 
            select[name], 
            textarea[name], 
            button[type="submit"],
            .mktoFormRow,
            .mktoButtonRow,
            .mktoPlaceholder,
            style
        `));

        // Track first occurrences and duplicates
        const firstOccurrences = new Map();
        const duplicatesToRemove = new Set();
        const submitButtons = [];
        const styleContents = new Set();
        const placeholderKeys = new Set();
        let duplicatesFound = false;

        // First pass: Identify elements
        allElements.forEach(element => {
            if (element.classList.contains('mktoFormRow') || element.classList.contains('mktoButtonRow')) {
                return; // Handle rows separately
            }

            // Handle <style> tag deduplication
            if (element.tagName.toLowerCase() === 'style') {
                const content = element.innerHTML.trim();
                if (styleContents.has(content)) {
                    duplicatesToRemove.add(element);
                } else {
                    styleContents.add(content);
                }
                return;
            }

            // Handle .mktoPlaceholder deduplication based on class list
            if (element.classList.contains('mktoPlaceholder')) {
                // Key based on tag name and class list
                const key = `${element.tagName.toLowerCase()}::${[...element.classList].sort().join(',')}`;

                if (placeholderKeys.has(key)) {
                    duplicatesToRemove.add(element);
                } else {
                    placeholderKeys.add(key);
                }
                return;
            }

            const name = element.getAttribute('name') || 
                        (element.tagName === 'BUTTON' ? 'submit-button' : null);
            
            if (!name) return;

            if (element.tagName === 'BUTTON' && element.type === 'submit') {
                submitButtons.push(element);
                return;
            }

            if (!firstOccurrences.has(name)) {
                firstOccurrences.set(name, element);
            } else {
                duplicatesToRemove.add(element);
            }
        });

        // Handle duplicate submit buttons (keep first, remove others)
        if (submitButtons.length > 1) {
            submitButtons.slice(1).forEach(button => {
                duplicatesToRemove.add(button);
            });
        }

        // Second pass: Remove duplicates
        for (let i = allElements.length - 1; i >= 0; i--) {
            const element = allElements[i];
            
            // Skip row elements in this pass
            if (element.classList.contains('mktoFormRow') || element.classList.contains('mktoButtonRow')) {
                continue;
            }

            if (duplicatesToRemove.has(element)) {
                const parentRow = element.closest('.mktoFormRow, .mktoButtonRow, .mktoFormCol');
                
                if (parentRow) {
                    if (parentRow.classList.contains('mktoFormRow') || 
                        parentRow.classList.contains('mktoFormCol')) {
                        parentRow.remove();
                        duplicatesFound = true;
                    }
                    // Skip button rows - we'll handle them separately
                } else {
                    element.remove();
                    duplicatesFound = true;
                }
            }
        }

        // Third pass: Clean up empty rows and duplicate button rows
        const allRows = Array.from(form.querySelectorAll('.mktoFormRow, .mktoButtonRow'));
        const seenButtonRows = new Set();
        
        allRows.forEach(row => {
            // Handle button rows separately
            if (row.classList.contains('mktoButtonRow')) {
                if (seenButtonRows.size > 0) {
                    row.remove();
                    duplicatesFound = true;
                } else {
                    seenButtonRows.add(row);
                }
                return;
            }

            if (
                row.childNodes.length === 0 || 
                (
                    row.childNodes.length === 1 &&
                    row.firstChild.nodeType === 1 &&
                    row.firstChild.classList.contains('mktoClear') &&
                    row.firstChild.childNodes.length === 0
                )
            ) {
                row.remove();
            }

            if	(
                !row.classList.contains('mkto-hidden') &&
                row.childNodes.length >= 1 &&
                row.firstChild.nodeType === 1 &&
                row.firstChild.tagName.toLowerCase() === 'input' &&
                row.firstChild.type.toLowerCase() === 'hidden'
            ) {
                row.classList.add('mkto-hidden');
            }
        });

        if (duplicatesFound) {
            //console.log('Body Form cleanup completed', form);
        }
        return duplicatesFound;
    }

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            const allForms = document.querySelectorAll('form.marketo-basic');
            allForms.forEach((form) => {
                cleanMarketoDuplicates(form);
            });
            setTimeout(() => {
                allForms.forEach((form) => {
                    cleanMarketoDuplicates(form);
                });
            }, 5000);

        }, 1000);

    });

    if (typeof MktoForms2 === "undefined") {
        setTimeout(arguments.callee, 10);
        return;
    }

    try {

        const forms = document.querySelectorAll("form.marketo-basic");
        if (null === forms || 0 === forms.length) {
            return;
        }

        // Process all Marketo forms
        forms.forEach((form) => {

            if (
                "undefined" !== form.dataset.formid &&
                "string" === typeof form.dataset.formid
            ) {

                let formID = form.dataset.formid;
                const MKTOFORM_ID_PREFIX = 'mktoForm_', 
                    MKTOFORM_ID_ATTRNAME = 'data-formid';
                
                if (formID.length > 0 && "undefined" !== typeof MktoForms2) {
                    var loadForm = MktoForms2.loadForm.bind(
                        MktoForms2,
                        "https://go.chainalysis.com/",
                        "503-FAP-074",
                        formID
                    ),
                    formEls = [].slice.call(
                        document.querySelectorAll('[' + MKTOFORM_ID_ATTRNAME + '="' + formID + '"]')
                    );

                    (function loadFormCb(formEls) {
                        var formEl = formEls.shift();
                        formEl.id = MKTOFORM_ID_PREFIX + formID;


                        loadForm(function(form) {
                            formEl.style.opacity = 1;
                            formEl.classList.remove("mktoForm");
                            formEl.classList.add("custom-mktoForm");

                            var elsWithStyles = formEl.querySelectorAll("[style]");
                            for (var i = 0, imax = elsWithStyles.length; i < imax; i++) {
                                elsWithStyles[i].removeAttribute("style");
                            }

                            for (var i = 0, styleSheets = document.styleSheets, imax = styleSheets.length; i < imax; i++) {
                                var ssLoc = document.createElement("A");
                                ssLoc.href = styleSheets[i].href;

                                if (
                                    ssLoc.hostname && ssLoc.hostname.search(/\.marketo\.com$/) !== -1 || // External styles
                                    (styleSheets[i].ownerNode || styleSheets[i].owningElement).parentNode === formEl
                                ) {
                                    styleSheets[i].disabled = true;
                                }
                            }
                            
                            formEl.id = '';
                            formEls.length && loadFormCb(formEls);
                        });

                    })(formEls);
                }
            }
            
        });

    } catch (err) {
        console.error('Marketo form error:', err);
    }
})();