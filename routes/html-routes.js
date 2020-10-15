const db = require("../models");
const WaveFile = require("wavefile").WaveFile;
const fs = require("fs");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/projects", (req, res) => {
    db.Project.findAll().then(function (result) {
      console.log(result);
      res.render("songs-dir", { project: result });
    });
  });

  app.get("/workstation/:id", (req, res) => {
    console.log("this is req.params.id: " + req.params.id);
    db.Project.findOne({
      where: {
        id: req.params.id,
      },
      include: db.Audiofile,
    }).then((project) => {
      for (let file of project.Audiofiles) {
        wav = new WaveFile();
        const wavData = file.audiotext;
        fs.writeFileSync(
          "./public/audio/" + file.path,
          Buffer.from(wavData.replace("data:audio/wav;base64,", ""), "base64")
        );
        file.path = "audio/" + file.path;
      }
      res.render("workstation", { project: project });
    });
  });
};
