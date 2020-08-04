import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

const intlTelInput = require("intl-tel-input");

AutoForm.addInputType("intl-tel", {
  template: "intlTelephoneInput",
  // valueIn: function(val, attrs){
  //   return val;
  // },
  valueOut: function () {
    let iti = intlTelInputGlobals.getInstance(this[0]);
    if (iti && iti.isValidNumber()) {
      return iti.getNumber();
    } else {
      return this.val();
    }
  },
});

// Template["intlTelephoneInput"].events({
//   "click #intl-telephone-input"(event, template) {
//     console.log("clicked #intl-telephone-input");
//     console.log(event);
//     console.log(template);
//   }
// });

// Template["intlTelephoneInput"].helpers({
// exampleHelper(p1, p2, p3) {
//   return "example helper result: " + p1 + "," + p2 + "," + p3;
// }
// });

/*
 * called when an instance of this template is inserted into the DOM.
 * This can be a good place to apply any DOM manipulations you want, after the template is rendered for the first time.
 * e.g. jQuery plugins
 */
Template["intlTelephoneInput"].onRendered(function () {
  const tmpl = Template.instance();
  const input = tmpl.$("input[type=tel]")[0];
  const { intlTelOptions = {} } = tmpl.data;
  this.iti.set(
    intlTelInput(input, {
      initialCountry: "auto",
      formatOnDisplay: true,
      geoIpLookup: function (success, failure) {
        fetch("https://freegeoip.app/json/")
          .then((resp) => resp.json())
          .then(({ country_code }) => success(country_code));
      },
      preferredCountries: ["us", "au", "gb", "ch"],
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js",
      ...intlTelOptions,
    })
  );
  $(input).on("keyup change", function () {
    const iti = tmpl.iti.get();
    if (!iti) return;
    if (typeof intlTelInputUtils !== "undefined") {
      const currentText = iti.getNumber(intlTelInputUtils.numberFormat.E164);
      if (typeof currentText === "string") iti.setNumber(currentText);
    }
  });
});

/*
 * called when an instance of this template is created.
 * called before the template’s logic is evaluated for the first time.
 * `this` is the new template instance object. Properties you set on this object will be visible from the callbacks added
 *  with onRendered and onDestroyed methods and from event handlers.
 */
Template["intlTelephoneInput"].onCreated(function () {
  this.iti = new ReactiveVar(false);
});

Template["intlTelephoneInput_bootstrap3"].inheritsEventsFrom(
  "intlTelephoneInput"
);
Template["intlTelephoneInput_bootstrap3"].inheritsHelpersFrom(
  "intlTelephoneInput"
);
Template["intlTelephoneInput_bootstrap3"].inheritsHooksFrom(
  "intlTelephoneInput"
);
Template["intlTelephoneInput_materialize"].inheritsEventsFrom(
  "intlTelephoneInput"
);
Template["intlTelephoneInput_materialize"].inheritsHelpersFrom(
  "intlTelephoneInput"
);
Template["intlTelephoneInput_materialize"].inheritsHooksFrom(
  "intlTelephoneInput"
);
