import authSlice from "@/lib/redux/slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import LoginForm from "../LoginForm";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

jest.mock("@/lib/api/authApi", () => ({
  authApi: {
    login: jest.fn(),
  },
}));

describe("LoginForm", () => {
  const mockOnToggleForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithStore = (store: any) => {
    return render(
      <Provider store={store}>
        <LoginForm onToggleForm={mockOnToggleForm} />
      </Provider>
    );
  };

  it("renders login form with all required fields", () => {
    const store = createMockStore();
    renderWithStore(store);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const store = createMockStore();
    renderWithStore(store);

    const submitButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    const store = createMockStore();
    renderWithStore(store);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const store = createMockStore();
    renderWithStore(store);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("calls onToggleForm when register link is clicked", () => {
    const store = createMockStore();
    renderWithStore(store);

    const registerLink = screen.getByText(/sign up here/i);
    fireEvent.click(registerLink);

    expect(mockOnToggleForm).toHaveBeenCalledTimes(1);
  });

  it("displays loading state when submitting", () => {
    const store = createMockStore({ loading: true });
    renderWithStore(store);

    const submitButton = screen.getByRole("button", { name: /Login/i });
    expect(submitButton).toBeDisabled();
  });

  it("displays error message when login fails", () => {
    const store = createMockStore({ error: "Invalid credentials" });
    renderWithStore(store);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("shows demo credentials info", () => {
    const store = createMockStore();
    renderWithStore(store);

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByText("password123")).toBeInTheDocument();
  });
});
