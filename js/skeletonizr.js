(function(Skeletonizr) {

  Skeletonizr.Model = Backbone.Model.extend({ /* ... */ });
  Skeletonizr.Collection = Backbone.Collection.extend({ /* ... */ });
  Skeletonizr.Router = Backbone.Router.extend({ /* ... */ });

  // This will fetch the tutorial template and render it.
  Skeletonizr.Views.Tutorial = Backbone.View.extend({
    template: "app/templates/skeletonizr.html",

    render: function(done) {
      var view = this;

      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
        view.el.innerHTML = tmpl();

        done(view.el);
      });
    }
  });

})(namespace.module("skeletonizr"));
