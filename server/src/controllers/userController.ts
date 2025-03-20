import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { getLatLngFromAddress } from "../services/googleService";
import bcrypt from "bcryptjs";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, address, role } = req.body;
  const requestingUser = req.user as IUser;

  // If logged in user is not an admin, default role to "user"
  const userRole = requestingUser.role === "admin" ? role : "user";

  try {
    const { latitude, longitude } = await getLatLngFromAddress(address);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      location: { latitude, longitude },
      role: userRole,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Exclude admin users from the query
    const query = search
      ? { name: new RegExp(search as string, "i"), role: { $ne: "admin" } }
      : { role: { $ne: "admin" } };

    const users = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select("-password");

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, address, role } = req.body;
  const requestingUser = req.user as IUser;

  try {
    const existingUser: any = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Allow users to edit their own accounts
    if (
      existingUser._id.toString() !==
        (requestingUser._id as string).toString() &&
      requestingUser.role !== "admin"
    ) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to perform this action",
      });
      return;
    }

    let updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (role) {
      updateData.role = role;
    }

    if (address && address !== existingUser.address) {
      const { latitude, longitude } = await getLatLngFromAddress(address);
      updateData.address = address;
      updateData.location = { latitude, longitude };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: (error as Error).message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};
