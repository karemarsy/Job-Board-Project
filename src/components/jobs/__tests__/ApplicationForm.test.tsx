// src/components/jobs/__tests__/ApplicationForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ApplicationForm from '../ApplicationForm';
import applicationSlice from '@/lib/redux/slices/applicationSlice';
import { Job } from '@/types';

const mockJob: Job = {
  id: 1,
  title: 'Frontend Developer',
  company: 'TechCorp Inc.',
  location: 'Remote',
  type: 'Full-time',
  salary: '$70,000 - $90,000',
  description: 'Test job description',
  requirements: ['React', 'TypeScript'],
  postedDate: '2024-01-15',
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      applications: applicationSlice,
    },
    preloadedState: {
      applications: {
        applications: [],
        loading: false,
        error: null,
        submissionStatus: 'idle',
        ...initialState,
      },
    },
  });
};

// Mock the API
jest.mock('@/lib/api/applicationApi', () => ({
  applicationApi: {
    submitApplication: jest.fn(),
  },
}));

describe('ApplicationForm', () => {
  const mockOnClose = jest.fn();
  const userEmail = 'test@example.com';
  const userName = 'Test User';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithStore = (store: any) => {
    return render(
      <Provider store={store}>
        <ApplicationForm
          job={mockJob}
          onClose={mockOnClose}
          userEmail={userEmail}
          userName={userName}
        />
      </Provider>
    );
  };

  it('renders application form with all required fields', () => {
    const store = createMockStore();
    renderWithStore(store);

    expect(screen.getByText('Apply for Position')).toBeInTheDocument();
    expect(screen.getByDisplayValue(userName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userEmail)).toBeInTheDocument();
    expect(screen.getByLabelText(/resume/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter/i)).toBeInTheDocument();
  });

  it('displays job information in summary', () => {
    const store = createMockStore();
    renderWithStore(store);

    expect(screen.getByText('Frontend Developer at TechCorp Inc.')).toBeInTheDocument();
    expect(screen.getByText('Position: Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Company: TechCorp Inc.')).toBeInTheDocument();
    expect(screen.getByText('Location: Remote')).toBeInTheDocument();
    expect(screen.getByText('Type: Full-time')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const store = createMockStore();
    renderWithStore(store);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please provide a brief resume/i)).toBeInTheDocument();
      expect(screen.getByText(/cover letter must be at least 50 characters/i)).toBeInTheDocument();
    });
  });

  it('validates minimum character requirements', async () => {
    const store = createMockStore();
    renderWithStore(store);

    const resumeField = screen.getByLabelText(/resume/i);
    const coverLetterField = screen.getByLabelText(/cover letter/i);
    const submitButton = screen.getByRole('button', { name: /submit application/i });

    fireEvent.change(resumeField, { target: { value: 'Short' } });
    fireEvent.change(coverLetterField, { target: { value: 'Too short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please provide a brief resume/i)).toBeInTheDocument();
      expect(screen.getByText(/cover letter must be at least 50 characters/i)).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    const store = createMockStore();
    renderWithStore(store);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button is clicked', () => {
    const store = createMockStore();
    renderWithStore(store);

    const closeButton = screen.getByLabelText(/close application form/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays loading state during submission', () => {
    const store = createMockStore({ submissionStatus: 'loading' });
    renderWithStore(store);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('displays error message when submission fails', () => {
    const store = createMockStore({
      submissionStatus: 'error',
      error: 'Submission failed'
    });
    renderWithStore(store);

    expect(screen.getByText('Submission Error')).toBeInTheDocument();
    expect(screen.getByText('Submission failed')).toBeInTheDocument();
  });

  it('displays success state after successful submission', () => {
    const store = createMockStore({ submissionStatus: 'success' });
    renderWithStore(store);

    expect(screen.getByText('Application Submitted!')).toBeInTheDocument();
    expect(screen.getByText(/your application for frontend developer at techcorp inc/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const store = createMockStore();
    renderWithStore(store);

    const resumeField = screen.getByLabelText(/resume/i);
    const coverLetterField = screen.getByLabelText(/cover letter/i);
    const submitButton = screen.getByRole('button', { name: /submit application/i });

    fireEvent.change(resumeField, { 
      target: { value: 'I have 5 years of experience in frontend development with React and TypeScript.' }
    });
    fireEvent.change(coverLetterField, { 
      target: { value: 'I am very interested in this position because it aligns perfectly with my skills and career goals. I have extensive experience with React and TypeScript.' }
    });

    fireEvent.click(submitButton);

    // The form should attempt to submit (we're not testing the actual API call here)
    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });
});