import People from "../models/People.js";
import APIFeatures from "../utils/apiFeatures.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connect from "../config/database.js";


// Create a new person
async function createPerson(req, res) {
  try {
    // Ensure conditional fields are provided
    if (
      req.body.nature === "WORKER_UNDER_CONTRACTOR" &&
      !req.body.contractorId
    ) {
      return res.status(400).json({
        message: "contractorId is required for WORKER_UNDER_CONTRACTOR.",
      });
    }
    if (req.body.nature === "EMPLOYEE" && !req.body.employeeId) {
      return res
        .status(400)
        .json({ message: "employeeId is required for EMPLOYEE." });
    }
    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const person = new People(req.body);
    const result = await person.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const createAdmin = async (event) => {
  try {
    await  connect();
    const reqBody = JSON.parse(event.body);

    // Ensure conditional fields are provided
    if (
      reqBody.nature === "WORKER_UNDER_CONTRACTOR" &&
      !reqBody.contractorId
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "contractorId is required for WORKER_UNDER_CONTRACTOR.",
        }),
      };
    }

    if (reqBody.nature === "EMPLOYEE" && !reqBody.employeeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "employeeId is required for EMPLOYEE." }),
      };
    }

    if (reqBody.password) {
      const saltRounds = 10;
      reqBody.password = await bcrypt.hash(reqBody.password, saltRounds);
    }

    const person = new People(reqBody);
    const result = await person.save();

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
// Get all people
const getPeople = async (req, res, next) => {
  try {
    const features = new APIFeatures(People.find(), req.query)
      // .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const people = await features.query;

    res.status(200).json({
      status: "success",
      results: people.length,
      data: {
        people,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all people with peopleType as PROJECT_MANAGER
export const getManagers = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      People.find({ peopleType: "PROJECT_MANAGER" }),
      req.query
    )
      // .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const managers = await features.query;

    res.status(200).json({
      status: "success",
      results: managers.length,
      data: {
        managers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific person by ID
async function getPersonById(req, res) {
  try {
    const person = await People.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a person by ID
async function updatePerson(req, res) {
  try {
    // Fetch the current person data
    const currentPerson = await People.findById(req.params.id);
    if (!currentPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    if (req.body.nature) {
      if (
        req.body.nature === "WORKER_UNDER_CONTRACTOR" &&
        !req.body.contractorId
      ) {
        return res.status(400).json({
          message: "contractorId is required for WORKER_UNDER_CONTRACTOR.",
        });
      }
      if (req.body.nature === "EMPLOYEE" && !req.body.employeeId) {
        return res
          .status(400)
          .json({ message: "employeeId is required for EMPLOYEE." });
      }
    }

    const person = await People.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a person by ID
async function deletePerson(req, res) {
  try {
    const person = await People.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const loginPerson = async (req, res) => {
  try {
    const { personalEmail, password } = req.body;

    const person = await People.findOne({ personalEmail });

    if (!person) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, person.password)) {
      const token = jwt.sign(
        {
          email: person.personalEmail,
          id: person._id,
          userType: person.userType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );

      person.token = token;

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
        domain: "https://main.d2q0ys24czjejd.amplifyapp.com/"
      });

      await person.save()

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: person._id,
          firstName: person.displayName,
          lastName: person.lastName,
          email: person.personalEmail,
          userType: person.peopleType,
        },
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

export { createPerson, getPeople, getPersonById, updatePerson, deletePerson };
