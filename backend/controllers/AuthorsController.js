const pool = require('../configs/db');
const logger = require('../utils/logger');

function AuthorsController() {}

const getQuery = `SELECT * FROM author`;

AuthorsController.prototype.get = async (req, res) => {
  try {
    logger.info('AuthorsController [GET]');
    const [authors] = await pool.query(getQuery);

    logger.info(`Authors count: ${authors.length}`);
    res.status(200).json({ authors });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

AuthorsController.prototype.create = async (req, res) => {
  try {
    const { name, birthday, bio } = req.body;
    logger.info(`[CREATE] name: ${name}, birthday: ${birthday}`);

    const insertQuery = `
      INSERT INTO author (name, birthday, bio, createdAt, updatedAt)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await pool.execute(insertQuery, [name, new Date(birthday), bio]);

    const [authors] = await pool.query(getQuery);
    logger.info(`Author created. Total authors: ${authors.length}`);

    res.status(200).json({
      message: `Author created successfully!`,
      authors,
    });
  } catch (error) {
    logger.error(`[CREATE] Error: ${error.message}`);
    res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

AuthorsController.prototype.update = async (req, res) => {
  try {
    const authorId = req.params.id;
    const { name, birthday, bio } = req.body;

    logger.info(`[UPDATE] id: ${authorId}, name: ${name}`);

    const updateQuery = `
      UPDATE author
      SET name = ?, birthday = ?, bio = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await pool.execute(updateQuery, [name, new Date(birthday), bio, authorId]);

    const [authors] = await pool.query(getQuery);
    logger.info(`Author updated. Total authors: ${authors.length}`);

    res.status(200).json({
      message: `Author updated successfully!`,
      authors,
    });
  } catch (error) {
    logger.error(`[UPDATE] Error: ${error.message}`);
    res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

AuthorsController.prototype.delete = async (req, res) => {
  try {
    const authorId = req.params.id;
    logger.info(`[DELETE] id: ${authorId}`);

    const deleteQuery = `DELETE FROM author WHERE id = ?`;
    await pool.execute(deleteQuery, [authorId]);

    const [authors] = await pool.query(getQuery);
    logger.info(`Author deleted. Total authors: ${authors.length}`);

    res.status(200).json({
      message: `Author deleted successfully!`,
      authors,
    });
  } catch (error) {
    logger.error(`[DELETE] Error: ${error.message}`);
    res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

module.exports = new AuthorsController();
