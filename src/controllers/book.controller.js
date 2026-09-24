import { Book } from "../models/Book.model.js";

export const getPublishedBooks = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      isAvailable,
      sort = "newest",
      page = 1,
      limit = 8,
    } = req.query;

    const query = { status: "Published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (isAvailable !== undefined && isAvailable !== "") {
      query.isAvailable = isAvailable === "true";
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { deliveryFee: 1 };
    if (sort === "price-high") sortOption = { deliveryFee: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalBooks = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      pagination: {
        totalBooks,
        totalPages: Math.ceil(totalBooks / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: "Published" })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      librarian: req.user.id,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Book submitted for approval",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLibrarianBooks = async (req, res) => {
  try {
    const books = await Book.find({ librarian: req.user.id });

    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLibrarianBookStatus = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        librarian: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        librarian: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      librarian: req.user.id,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminApprovalQueue = async (req, res) => {
  try {
    const books = await Book.find({ status: "Pending" });

    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status: "Published" },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBooksAdmin = async (req, res) => {
  try {
    const books = await Book.find();

    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateBookStatus = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminDeleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};