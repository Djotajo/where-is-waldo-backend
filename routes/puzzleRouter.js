const { Router } = require("express");

const { Prisma } = require("@prisma/client");

const puzzleRouter = Router();

const db = require("../db/queries");

// GET POSTS BY AUTHOR
puzzleRouter.get("/:puzzleId", async (req, res) => {
  const { puzzleId } = req.params;
  const puzzle = await db.getPuzzleById(puzzleId);
  res.json(puzzle);
});

// CREATE A NEW POST
dashboardRouter.post("/posts", authenticateAuthor, async (req, res) => {
  const { id, title, text, published } = req.body;
  const authorId = req.user.id;

  try {
    const post = await db.postNewPost(id, title, text, authorId, published);
    res.status(201).json(post);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SPECIFIC POST BY ID
dashboardRouter.get("/posts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const post = await db.getPost(postId);
  res.json(post);
});

// EDIT POST
dashboardRouter.put("/posts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const { title, text, published, createdAt } = req.body;

  try {
    const post = await db.updatePost(postId, title, text, published, createdAt);
    res.status(200).json(post);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE POST
dashboardRouter.delete(
  "/posts/:postId",
  authenticateAuthor,
  async (req, res) => {
    const { postId } = req.params;
    const post = await db.deletePost(postId);
    res.json(post);
  }
);

// GET SPECIFIC DRAFT BY ID
dashboardRouter.get("/drafts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const draft = await db.getPost(postId);
  res.json(draft);
});

// UPDATE DRAFT
dashboardRouter.put("/drafts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const { title, text, published, createdAt } = req.body;

  try {
    const draft = await db.updatePost(
      postId,
      title,
      text,
      published,
      createdAt
    );
    res.status(200).json(draft);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST COMMENT
dashboardRouter.post(
  "/posts/:postId/comments",
  authenticateAuthor,
  async (req, res) => {
    const { postId } = req.params;
    const { text, authorId, userId } = req.body;
    const parentId = postId;
    const comment = await db.postNewComment(text, userId, authorId, parentId);
    res.json(comment);
  }
);

// EDIT COMMENT
dashboardRouter.put(
  "/:postId/comments/:commentId",
  authenticateAuthor,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const comment = await db.editComment(commentId, text);
    res.json(comment);
  }
);

// DELETE COMMENT
dashboardRouter.delete(
  "/posts/:postId/comments/:commentId",
  authenticateAuthor,
  async (req, res) => {
    const { commentId } = req.params;
    const comment = await db.deleteComment(commentId);
    res.json(comment);
  }
);

module.exports = puzzleRouter;
