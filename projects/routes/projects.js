var express = require("express");
var router = express.Router();
var Project = require("../models/Project");

router.get("/", async (req, res) => {
    const projects = await Project.find();
    res.render("projects/index", { projects });
});

router.get("/new", (req, res) => {
    res.render("projects/new");
});

router.post("/", async (req, res) => {
    await Project.create(req.body);
    res.redirect("/projects");
});

router.get("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render("projects/show", { project });
});

router.post("/:id/delete", async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/projects");
});

router.post("/:id/add-member", async (req, res) => {
    const project = await Project.findById(req.params.id);
    project.clanovi.push(req.body.clan);
    await project.save();
    res.redirect("/projects/" + req.params.id);
});

module.exports = router;
