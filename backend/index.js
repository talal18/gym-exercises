var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var http = require("http").Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//connect to Mongoose
mongoose.connect("mongodb://talal.tk:27017/gym", { useNewUrlParser: true });

//coach
var Exercise = mongoose.model("Exercise", {
  targetedMuscle: String,
  name: String,
  sets: String,
  reps: Array,
  desc: String
});

//what I do
var Progress = mongoose.model("Progress", {
  exerciseId: String,
  sets: String,
  reps: [],
  notes: String
});

//Insert and save into the exercises table
app.post("/exercises", function(req, res) {
  const exercise = new Exercise({
    targetedMuscle: req.body.targetedMuscle,
    name: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    desc: req.body.desc
  });

  exercise
    .save()
    .then(() => res.send(exercise))
    .catch(error => res.send(error));
});

//Insert and save into the progress table
app.post("/progress", function(req, res) {
  const progress = new Progress({
    exerciseId: req.body.exerciseId,
    sets: req.body.sets,
    reps: req.body.reps,
    notes: req.body.notes
  });

  progress
    .save()
    .then(() => res.send(progress))
    .catch(error => res.send(error));
});

//SELECT * FROM exercises
app.get("/exercises", function(req, res) {
  Exercise.find().then(result => {
    res.send(result);
  });
});

// SELECT * FROM exercises WHERE _id = id
app.get("/exercises/:id", function(req, res) {
  Exercise.find({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

//Delete exercise by ID
app.delete("/exercises/:id", function(req, res) {
  Exercise.findByIdAndRemove(req.params.id).then(result => {
    res.send(result);
  });
});

// SELECT * FROM progress
app.get("/progress", function(req, res) {
  Progress.find().then(result => {
    res.send(result);
  });
});

// SELECT * FROM progress WHERE _id = id
app.get("/progress/:id", function(req, res) {
  Progress.find({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

app.get("/progress/:exerciseId", function(req, res) {
  Progress.find({ exerciseId: req.params.exerciseId }).then(result => {
    res.send(result);
  });
});

//run it on port 4000
http.listen(4000);
