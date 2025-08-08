// src/lib/api/authApi.ts
import { LoginCredentials, RegisterData, User } from "@/types";

const API_BASE_URL = "http://localhost:3001";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Fetch users from mock API
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error("Network error");
      }

      const users = await response.json();

      // Find user with matching credentials
      const user = users.find(
        (u: User & { password: string }) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Return user without password
      const { ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  async register(userData: RegisterData): Promise<User> {
    try {
      // Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Check if user already exists
      const existingUsersResponse = await fetch(`${API_BASE_URL}/users`);
      const existingUsers = await existingUsersResponse.json();

      const existingUser = existingUsers.find(
        (u: User) => u.email === userData.email
      );

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now(), // Simple ID generation for demo
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const createdUser = await response.json();

      // Return user without password
      const { ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
};
