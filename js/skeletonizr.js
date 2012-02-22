String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function(){

  window.Definition = Backbone.Model.extend({

     defaults: function() {
       return {
         name:  'Section or Entity',
         type:  'entity',
         scope: 'global'
       };
     },

    save: function(attributes, options) {
    },

  });

  window.DefinitionList = Backbone.Collection.extend({

      model: Definition,

  });

  window.Definitions = new DefinitionList;

  window.DefinitionView = Backbone.View.extend({

      tagName:  "tr",

      template: _.template($('#model-item-template').html()),

      events: {
        "click .edit"    : "edit",
        "click .delete"   : "clear",
      },

      initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        this.setText();
        return this;
      },

      setText: function() {
        var text = this.model.get('text');
        this.$('.definition-text').text(text);
        this.input = this.$('.definition-input');
        this.input.bind('blur', _.bind(this.close, this)).val(text);
      },

      edit: function(e) {
        e.preventDefault();
        alert('Edit');
        return;
        $(this.el).addClass("editing");
        this.input.focus();
      },

      close: function() {
        this.model.save({text: this.input.val()});
        $(this.el).removeClass("editing");
      },

      updateOnEnter: function(e) {
        if (e.keyCode == 13) this.close();
      },

      remove: function() {
        $(this.el).remove();
      },

      clear: function(e) {
        e.preventDefault();
        this.model.destroy();
      }

    });

  window.AppView = Backbone.View.extend({

    el: $("#skeletonizr-app"),

    //statsTemplate: _.template($('#stats-template').html()),

    events: {
      "click #new-definition":  "createNewDefinition",
      "click #generate-dyn-skeleton": "generateSkeleton"
    },

    initialize: function() {
      this.input    = this.$("#new-definition");

      Definitions.bind('add',   this.addOne, this);
      Definitions.bind('reset', this.addAll, this);
      Definitions.bind('all',   this.render, this);

      Definitions.add(new Definition({type:'section', name:'Home', scope: 'frontend'}));
      Definitions.add(new Definition({type:'section', name:'Profile', scope: 'frontend'}));
      Definitions.add(new Definition({type:'entity',  name:'Customer', scope: 'global', basedon: 'customer'}));
      Definitions.add(new Definition({type:'entity',  name:'Department', scope: 'global', basedon: 'department'}));
      Definitions.add(new Definition({type:'entity',  name:'Employee', scope: 'global', basedon: 'employee'}));
    },

    render: function() {
    },

    addOne: function(modeldef) {
      var view = new DefinitionView({model: modeldef});
      $("#definitions tbody").append(view.render().el);
    },

    addAll: function() {
      Definitions.each(this.addOne);
    },

    createNewDefinition: function(e) {
      e.preventDefault();
      Definitions.create({type:'section', name:'Hola', scope: 'frontend'});
    },

    generateSkeleton: function(e) {
      e.preventDefault();

      var data = JSON.stringify(Definitions);

      $.post('http://localhost:9000/gen', data, function(){
        alert('arg');
      });

    },

  });

  window.App = new AppView;

});
