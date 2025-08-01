const pool = require('../configs/db');
const logger = require('../utils/logger'); // Import logger

function BooksController() { }

const getQuery = `SELECT b.id as id, b.title as title, b.releaseDate as releaseDate, b.description as description, b.pages as pages,
 b.createdAt as createdAt, b.updatedAt as updatedAt, a.id as authorId, a.name as name, a.birthday as birthday, a.bio as bio FROM book b INNER JOIN author a on b.authorId = a.id`;

BooksController.prototype.get = async (req, res) => {
   try {
      const [books] = await pool.query(getQuery);

      logger.info(`Books count: ${books.length}`);

      res.status(200).json({ books });
   } catch (error) {
      logger.error(`Error executing query: ${err.message}`);

      res.status(500).json({ message: "Something unexpected has happened." });
   }
};

BooksController.prototype.create = async (req, res) => {
  try {
    const {
      title,
      description,
      releaseDate,
      pages,
      author: authorId,
    } = req.body;

    logger.info(`[CREATE] title: ${title}, releaseDate: ${releaseDate}, pages: ${pages}, authorId: ${authorId}`);

    const insertQuery = `
      INSERT INTO book (title, releaseDate, description, pages, authorId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await pool.execute(insertQuery, [title, new Date(releaseDate), description, pages, authorId]);

    const [books] = await pool.query(getQuery);

    logger.info(`Book created. Total books: ${books.length}`);
    return res.status(200).json({
      message: `Book created successfully!`,
      books,
    });
  } catch (error) {
    logger.error(`[CREATE] Error: ${error.message}`);
    return res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};;

BooksController.prototype.update = async (req, res) => {
  try {
    const bookId = req.params.id;
    const {
      title,
      description,
      releaseDate,
      pages,
      author: authorId,
    } = req.body;

    logger.info(`[UPDATE] id: ${bookId}, title: ${title}`);

    const updateQuery = `
      UPDATE book
      SET title = ?, releaseDate = ?, description = ?, pages = ?, authorId = ?, updatedAt = NOW()
      WHERE id = ?
    `;

    await pool.execute(updateQuery, [title, new Date(releaseDate), description, pages, authorId, bookId]);

    const [books] = await pool.query(getQuery);

    logger.info(`Book updated. Total books: ${books.length}`);
    return res.status(200).json({
      message: `Book updated successfully!`,
      books,
    });
  } catch (error) {
    logger.error(`[UPDATE] Error: ${error.message}`);
    return res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

BooksController.prototype.delete = async (req, res) => {
  try {
    const bookId = req.params.id;

    logger.info(`[DELETE] id: ${bookId}`);

    const deleteQuery = `DELETE FROM book WHERE id = ?`;
    await pool.execute(deleteQuery, [bookId]);

    const [books] = await pool.query(getQuery);

    logger.info(`Book deleted. Total books: ${books.length}`);
    return res.status(200).json({
      message: `Book deleted successfully!`,
      books,
    });
  } catch (error) {
    logger.error(`[DELETE] Error: ${error.message}`);
    return res.status(500).json({
      message: "Something unexpected has happened. Please try again later.",
    });
  }
};

module.exports = new BooksController();