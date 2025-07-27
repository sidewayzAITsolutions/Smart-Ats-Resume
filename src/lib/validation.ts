// src/lib/validation.ts

import { z } from 'zod'; // Assuming Zod for schema validation

// Schema for personal information
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().optional().refine((val) => !val || /^\+?[0-9\s-()]{7,20}$/.test(val), 'Invalid phone number format'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')), // Allow empty string
  portfolio: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')), // Allow empty string
  address: z.string().optional().max(200, 'Address is too long'),
});

// Schema for education entries
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Date format should be YYYY-MM'),
  endDate: z.string().optional().regex(/^\d{4}-\d{2}$/, 'Date format should be YYYY-MM').or(z.literal('')), // Allow empty string
  description: z.string().optional().max(500, 'Description is too long'),
});

// Schema for experience entries
export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Date format should be YYYY-MM'),
  endDate: z.string().optional().regex(/^\d{4}-\d{2}$/, 'Date format should be YYYY-MM').or(z.literal('')), // Allow empty string
  isCurrent: z.boolean().optional(), // Indicates if it's a current job
  description: z.string().min(1, 'Job description/achievements are required').max(1000, 'Description is too long'),
});

// Schema for skills (array of strings)
export const skillsSchema = z.object({
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required'),
});

// Main resume schema combining all parts
export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: skillsSchema,
  // Add other sections as needed (e.g., projects, awards)
});

// Example of a function to validate data against a schema
export function validateData<T>(schema: z.ZodSchema<T>, data: any): { success: boolean; data?: T; error?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}
