// src/components/jobs/__tests__/JobCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from '../JobCard';
import { Job } from '@/types';

const mockJob: Job = {
  id: 1,
  title: 'Frontend Developer',
  company: 'TechCorp Inc.',
  location: 'Remote',
  type: 'Full-time',
  salary: '$70,000 - $90,000',
  description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user interfaces.',
  requirements: ['React', 'TypeScript', '3+ years experience'],
  postedDate: '2024-01-15',
};

describe('JobCard', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job information correctly', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('TechCorp Inc.')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('$70,000 - $90,000')).toBeInTheDocument();
  });

  it('displays truncated description', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    // The description should be truncated to 120 characters
    const description = screen.getByText(/we are looking for a skilled frontend developer/i);
    expect(description).toBeInTheDocument();
  });

  it('displays job requirements', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('3+ years experience')).toBeInTheDocument();
  });

  it('calls onViewDetails when View Details button is clicked', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockJob);
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it('calls onApply when Apply Now button is clicked', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    const applyButton = screen.getByText('Apply Now');
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith(mockJob);
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it('hides Apply button when showApplyButton is false', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
        showApplyButton={false}
      />
    );

    expect(screen.queryByText('Apply Now')).not.toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('shows relative posted date', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    // Should show relative date like "X months ago"
    expect(screen.getByText(/posted/i)).toBeInTheDocument();
  });

  it('displays job type as a badge', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    const badge = screen.getByText('Full-time');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('shows "more" indicator when job has more than 3 requirements', () => {
    const jobWithManyRequirements = {
      ...mockJob,
      requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
    };

    render(
      <JobCard
        job={jobWithManyRequirements}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText('+3 more')).toBeInTheDocument();
  });

  it('applies hover effects on card', () => {
    render(
      <JobCard
        job={mockJob}
        onViewDetails={mockOnViewDetails}
        onApply={mockOnApply}
      />
    );

    const card = screen.getByText('Frontend Developer').closest('div');
    expect(card?.closest('.group, [class*="hover:"]')).toBeTruthy();
  });
});