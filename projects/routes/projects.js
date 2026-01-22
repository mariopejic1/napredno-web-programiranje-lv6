const express = require('express');
const router = express.Router();

const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/my', auth, async (req, res) => {
    const projects = await Project.find({ voditelj: req.session.userId, arhiviran: false })
                                  .populate('voditelj')
                                  .populate('clanovi');
    res.render('projects/index', { projects, viewType: 'my' });
});

router.get('/member', auth, async (req, res) => {
    const projects = await Project.find({ 
        clanovi: req.session.userId, 
        arhiviran: false 
    }).populate('voditelj').populate('clanovi');
    res.render('projects/index', { projects, viewType: 'member' });
});

router.get('/archive', auth, async (req, res) => {
    const projects = await Project.find({
        arhiviran: true,
        $or: [
            { voditelj: req.session.userId },
            { clanovi: req.session.userId }
        ]
    }).populate('voditelj').populate('clanovi');
    res.render('projects/index', { projects, viewType: 'archive' });
});

router.get('/new', auth, (req, res) => {
    res.render('projects/new');
});

router.post('/new', auth, async (req, res) => {
    await Project.create({ ...req.body, voditelj: req.session.userId });
    res.redirect('/projects/my');
});


router.get('/:id', auth, async(req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('clanovi')
            .populate('voditelj');

        if(!project) return res.redirect('/projects/my'); 

        const users = await User.find();

        const userId = req.session.userId.toString();
        const isLeader = project.voditelj._id.toString() === userId;
        const isMember = project.clanovi.some(c => c._id.toString() === userId);

        res.render('projects/show', {project, users, isLeader, isMember});
    } catch(err) {
        console.log(err);
        res.redirect('/projects/my'); 
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project || project.arhiviran) return res.redirect('/projects');
    if (!project.voditelj.equals(req.session.userId)) return res.redirect('/projects');
    res.render('projects/edit', { project });
});

router.post('/:id/edit', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project || project.arhiviran) return res.redirect('/projects');
    if (project.voditelj.equals(req.session.userId)) {
        await Project.findByIdAndUpdate(req.params.id, req.body);
    }
    res.redirect('/projects/' + req.params.id);
});

router.post('/:id/delete', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project && !project.arhiviran && project.voditelj.equals(req.session.userId)) {
        await Project.findByIdAndDelete(req.params.id);
    }
    res.redirect('/projects/my');
});

router.post('/:id/add-member', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project || project.arhiviran) return res.redirect('/projects/' + req.params.id);

    const userId = req.body.clan;

    if (project.voditelj.equals(userId)) return res.redirect('/projects/' + req.params.id); 
    if (!project.clanovi.includes(userId)) {
        project.clanovi.push(userId);
        await project.save();
    }
    res.redirect('/projects/' + req.params.id);
});

router.post('/:id/tasks', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project || project.arhiviran) return res.redirect('/projects/' + req.params.id);

    project.obavljeni_poslovi.push(req.body.posao);
    await project.save();
    res.redirect('back');
});

router.post('/:id/archive', auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project && !project.arhiviran && project.voditelj.equals(req.session.userId)) {
        project.arhiviran = true;
        await project.save();
    }
    res.redirect('/projects/archive');
});

module.exports = router;
