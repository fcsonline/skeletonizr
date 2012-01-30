var express  = require("express");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/{{project}}');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

{% for entity in entities %}
var {{entity|capfirst}}Schema = new Schema({
    id            : ObjectId
  , title         : String
  , description   : String
  , date          : Date
});
{% endfor %}

// The mongo collections
{% for entity in entities %}
var {{entity|capfirst}} = mongoose.model('{{entity|capfirst}}', {{entity|capfirst}}Schema);
{% endfor %}

function defaultSaveMongo(err){
  // saving is asynchronous
  if(err) console.log("Something went wrong while saving the thing");
  else console.log("Thing was successfully saved");
};

// Creating some instances
{% for entity in entities %}
var {{entity}}1 = new {{entity|capfirst}}({title:'hello world'});
var {{entity}}2 = new {{entity|capfirst}}({title:'hello world'});
var {{entity}}3 = new {{entity|capfirst}}({title:'hello world'});

{{entity}}1.save(defaultSaveMongo);
{{entity}}2.save(defaultSaveMongo);
{{entity}}3.save(defaultSaveMongo);
{% endfor %}

var app = express.createServer();

app.configure(function() {

    // Standard express setup
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    // Use the Jade template engine
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });

});

app.get("/", function(req, resp) {
    resp.render("home", {
        pageTitle: "Ticker Analysis Sample"
    });
});

{% for entity in entities %}
// List for {{entity}} entity
app.get("/{{entity}}/", function(req, resp) {
    console.log('Reading list of "{{entity}}" entities ')
    var {{entity|capfirst}} = mongoose.model("{{entity|capfirst}}", "{{entity}}");

    {{entity|capfirst}}.find({}, [], {}, function(err, docs) {
        console.log('Readed "{{entity}}" ' + docs);
        docs = docs.map(function(d) {
          return { title: d.title, id: d._id };
        });

        resp.send(JSON.stringify(docs));
    });
});

// Detail for {{entity}} entity
app.get("/{{entity}}/:id", function(req, resp) {
    console.log('Reading entity "{{entity}}" with id ' + req.params.id)
    var {{entity|capfirst}} = mongoose.model("{{entity|capfirst}}", "{{entity}}");
    {{entity|capfirst}}.findById(req.params.id, function(err, data) {
        if(err) {
            // Handle error
        }
        resp.send(JSON.stringify(data));
    });
});
{% endfor %}

app.listen(9000);
