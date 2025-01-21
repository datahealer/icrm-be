import express from "express";
import {
  createPerson,
  getPeople,
  getPersonById,
  updatePerson,
  deletePerson,
  loginPerson,
  getManagers,
} from "../controllers/peopleController.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

// Create a new person
router.post("/create", auth, createPerson);

// Get all people
router.get("/getPeople", auth, getPeople);

router.get("/getManagers", auth, getManagers);

router.post("/loginPerson", loginPerson);

// Get a specific person by ID
router.get("/:id", getPersonById);

// Update a person by ID
router.put("/:id", updatePerson);

// Delete a person by ID
router.delete("/:id", deletePerson);

export default router;
