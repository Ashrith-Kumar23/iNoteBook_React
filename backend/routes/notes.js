const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: get all notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        return res.status(400).json({ errors: errors.array() });
    }
});

// ROUTE 2: CREATE NOTES
router.post(
    "/addnote",
    fetchuser,
    [
        body("title", "Enter valid title").isLength({ min: 3 }),
        body("description", "Enter More description").isLength({ min: 5 }),
    ],
    async (req, res) => {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // CREATING NOTE
        try {
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save()

            res.json(saveNote);

        } catch (error) {
            return res.status(400).json({ errors: errors.array() });
        }

    }
);

// ROUTE 3: UPDATE NOTES
router.put(
    "/updatenote/:id",
    fetchuser,
    async (req, res) => {

        const { title, description, tag } = req.body;
        try {
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(400).send("Not Found"); }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed");
            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json(note)
        } catch (error) {
            return res.status(400).json({ errors: errors.array() });
        }

    }
);

// ROUTE 4: DELETE NOTES
router.delete(
    "/deletenote/:id",
    fetchuser,
    async (req, res) => {

        const { title, description, tag } = req.body;

        try {
            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(400).send("Not Found"); }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed");
            }

            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Successfully DELETED !!!", note: note })
        } catch (error) {
            return res.status(400).json({ errors: errors.array() });
        }

    }
);



module.exports = router;
