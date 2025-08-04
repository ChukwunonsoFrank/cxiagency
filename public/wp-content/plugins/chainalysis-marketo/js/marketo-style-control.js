"use strict";
(function () {
	const debuggingURL = new URL(window.location.href);
	const hasDebugParam = debuggingURL.searchParams.has("debug");
	const debugOption = debuggingURL.searchParams.get("debug");
	const debugModeOn = hasDebugParam && "marketo" === debugOption;
	if (debugModeOn) {
		console.debug("Debug mode enabled.");
	}

	/**
	 * @author Sanford Whiteman
	 * @version v1.105-chain1.3.6a
	 * @license MIT License: This license must appear with all reproductions of this software.
	 *
	 * Create a completely barebones, user-styles-only Marketo form
	 * by removing inline STYLE attributes and disabling STYLE and LINK elements
	 */
	function destyleMktoForm(mktoForm, options) {
		var formEl = mktoForm.getFormElem()[0],
			arrayFrom = Function.prototype.call.bind(Array.prototype.slice),
			options = options || {};

		// Check whether there's a loading message in the form, like in this format: <span class="loading-message"></span>, and hide it when the form finishes loading / rendering
		let possibleLoadingMsg = formEl.firstChild.classList;
		if (
			undefined !== possibleLoadingMsg &&
			"loading-message" === possibleLoadingMsg.value
		) {
			// Hide the loading message if one exists
			formEl.firstChild.hidden = true;
		}

		// Remove element styles from <form> and children
		if (!options.keepInline) {
			var styledEls = arrayFrom(
				formEl.querySelectorAll("[style]")
			).concat(formEl);
			styledEls.forEach(function (el) {
				el.removeAttribute("style");
			});

			// Remove "mktoHasWidth" class from the form and inner elements, which Marketo uses to assign inline styles on window resize
			var hasWidthEls = arrayFrom(
				formEl.querySelectorAll(".mktoHasWidth")
			).concat(formEl);
			hasWidthEls.forEach(function (el) {
				el.classList.remove("mktoHasWidth");
			});
		}

		// disable remote stylesheets and local <style>s
		if (!options.keepSheets) {
			var styleSheets = arrayFrom(document.styleSheets);
			styleSheets.forEach(function (ss) {
				if (
					[mktoForms2BaseStyle, mktoForms2ThemeStyle].indexOf(
						ss.ownerNode
					) != -1 ||
					formEl.contains(ss.ownerNode)
				) {
					ss.disabled = true;
				}
			});
		}

		if (!options.moreStyles) {
			formEl.setAttribute("data-styles-ready", "true");
		}
	}

	// Hide hidden input fields located in Marketo forms
	function hideHiddenInputs(mktoForm) {
		const hiddenInputs = mktoForm
			.getFormElem()[0]
			.querySelectorAll('.mktoFormRow > input[type="hidden"]');
		hiddenInputs.forEach((inputs) =>
			inputs.closest(".mktoFormRow").classList.add("mkto-hidden")
		);
	}

	// Hide unused required field labels, e.g. checkbox lists with no description.
	// This fixes a formatting issue with required checkboxlist items.
	function updateRequiredFieldDisplay(mktoForm) {
		const mktoRequiredLabels = mktoForm
			.getFormElem()[0]
			.querySelectorAll(".mktoRequiredField > .mktoLabel");

		mktoRequiredLabels.forEach((label) => {
			// If label innerText is only an asterisk, then add a class to the label to hide it
			// We don't hide empty labels at this time because they provide visual separation between checkbox fields and other field types
			if ("*" === label.innerText) {
				label.classList.add("mkto-label-hidden");

				// If the parent node contains a marketo checkbox list with a label inside it
				// And if that label innerText does not start with an asterisk
				// then prepend an asterisk to the innerText
				const parent = label.parentNode;
				if (
					parent.contains(
						parent.querySelector(".mktoCheckboxList > label")
					)
				) {
					if (
						parent.querySelectorAll(".mktoCheckboxList > label")
							.length !== 1
					) {
						if (debugModeOn) {
							console.debug(
								"Marketo formatting: Detected unexpected checkbox-related form structure."
							);
						}
					} else {
						const label = parent.querySelector(
							".mktoCheckboxList > label"
						);
						if (
							"" !== label.innerText &&
							"*" !== label.innerText.charAt(0)
						) {
							// Prepend an asterisk to the innerText
							label.prepend("* ");
						}
					}
				}
			}
		});

		// const mktoRequiredCheckboxList
	}

	// Always runs
	if (!window.MktoForms2) {
		setTimeout(this.loadExternalForm, 500);
	} else {
		// https://developers.marketo.com/javascript-api/forms/api-reference/
		window.MktoForms2.whenRendered(function (form) {
			destyleMktoForm(form);
			hideHiddenInputs(form);
			updateRequiredFieldDisplay(form);
		});

		// We add this attribute to help us manage the form styling as it loads, e.g. the fade-in effect
		MktoForms2.whenReady(function (form) {
			form.getFormElem()[0].setAttribute("data-mkto-ready", "true");

			const emailElement = form
				.getFormElem()[0]
				.querySelector('[name="Email"]');

			if (!emailElement && debugModeOn) {
				console.debug("No email element found.");
			}

			// You can still include any custom validation logic here if needed
			form.onValidate(function (validationSuccess) {
				if (!validationSuccess) {
					// Error: Form not valid by default, e.g. required fields might be incomplete.
					return;
				}
 
			});
		});

	}
})();
