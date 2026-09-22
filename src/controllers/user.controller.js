import { User } from '../models/User.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search,$options: 'i' } },
            { email: { $regex: search,$options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user list', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'librarian', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated successfully to '${role}'`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

   
    const targetUser = await User.findById(id);
    if (targetUser?.email === req.user.email) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};