const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [newRoutine] } = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4) RETURNING *`,
      [creatorId, isPublic, name, goal]
    );
    return newRoutine;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine]}= await client.query(`
SELECT * FROM routines WHERE id= $1
    `,[id])

    return routine
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
    
    
    `);
    return routines;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {
  try {
    const { rows: routine_activities} = await client.query(
      `
      DELETE FROM routine_activities WHERE "routineId" = $1`,
      [id]
    );
const { rows } = await client.query(
  `
  DELETE FROM routines
  WHERE id = $1
  RETURNING *;
`,
  [id]
);

   const outturn = {
     deletedRoutineActivity: routine_activities[0],
     deletedRoutine: rows[0]
   };
   return (outturn)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
