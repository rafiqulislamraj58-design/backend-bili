import { Book } from '../models/Book.model.js';


export const getPublishedBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = '',
      category = '',
      minFee,
      maxFee,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = { status: 'Published' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minFee || maxFee) {
      query.deliveryFee = {};
      if (minFee) query.deliveryFee.$gte = Number(minFee);
      if (maxFee) query.deliveryFee.$lte = Number(maxFee);
    }

    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [books, totalBooks] = await Promise.all([
      Book.find(query).sort(sortOptions).skip(skip).limit(pageSize),
      Book.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBooks / pageSize);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        totalBooks,
        totalPages,
        currentPage: pageNumber,
        pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books', error: error.message });
  }
};


export const getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find({ status: 'Published' })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({ success: true, data: featuredBooks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book details', error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, description, category, deliveryFee, coverImage } = req.body;
    const librarianEmail = req.user.email;

    if (!title || !author || !description || !category || deliveryFee === undefined || !coverImage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBook = await Book.create({
      title,
      author,
      description,
      category,
      deliveryFee: Number(deliveryFee),
      coverImage,
      librarianEmail,
      status: 'Pending Approval', 
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: 'Book submitted for admin approval', data: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
};

export const getLibrarianBooks = async (req, res) => {
  try {
    const librarianEmail = req.user.email;
    const books = await Book.find({ librarianEmail }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
  }
};

export const updateLibrarianBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const librarianEmail = req.user.email;

    const book = await Book.findOne({ _id: id, librarianEmail });

    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }

    if (book.status === 'Pending Approval') {
      return res.status(400).json({ message: 'Cannot modify status while book is pending admin approval' });
    }

    if (!['Published', 'Unpublished'].includes(status)) {
      return res.status(400).json({ message: 'Status can only be toggled between Published and Unpublished' });
    }

    book.status = status;
    await book.save();

    res.status(200).json({ success: true, message: `Book marked as ${status}`, data: book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book status', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const librarianEmail = req.user.email;

    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, librarianEmail },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const librarianEmail = req.user.email;

    const deletedBook = await Book.findOneAndDelete({ _id: id, librarianEmail });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

export const getAdminApprovalQueue = async (req, res) => {
  try {
    const pendingBooks = await Book.find({ status: 'Pending Approval' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pendingBooks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approval queue', error: error.message });
  }
};

export const approveBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(
      id,
      { status: 'Published' },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book approved and published', data: book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve book', error: error.message });
  }
};

export const getAllBooksAdmin = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all books', error: error.message });
  }
};

export const adminUpdateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const book = await Book.findByIdAndUpdate(id, { status }, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change book status', error: error.message });
  }
};


export const adminDeleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book removed by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};