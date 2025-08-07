// src/components/jobs/JobFilters.tsx
'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFilters, clearFilters } from '@/lib/redux/slices/jobSlice';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, X } from 'lucide-react';

const jobTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Remote', label: 'Remote' },
];

const JobFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.jobs);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ type: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ location: e.target.value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.search || filters.type || filters.location;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select
            options={jobTypeOptions}
            value={filters.type}
            onChange={handleTypeChange}
            placeholder="Job Type"
          />
          
          <Input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={handleLocationChange}
          />
        </div>
        
        {hasActiveFilters && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Type: {filters.type}
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Location: {filters.location}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobFilters;