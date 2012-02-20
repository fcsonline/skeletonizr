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
      console.log('Saveeeee');
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
        "keypress .definition-input"      : "updateOnEnter"
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
      //"keyup #new-definition":     "showTooltip",
      //"click .definition-clear a": "clearCompleted"
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
      //this.$('#definition-stats').html(this.statsTemplate({
      //  total:      Definitions.length,
      //  done:       Definitions.done().length,
      //  remaining:  Definitions.remaining().length
      //}));
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

    clearCompleted: function() {
      _.each(Definitions.done(), function(definition){ definition.destroy(); });
      return false;
    },

    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }

  });

  window.App = new AppView;

});
