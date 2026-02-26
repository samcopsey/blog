import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  pillar: z.enum(['agent-building', 'engineering-leadership', 'sovereign-ai', 'development']),
  format: z.enum(['how-to', 'opinion', 'architecture', 'project-writeup']),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
  heroImage: z.string().optional(),
  githubRepo: z.string().url().optional(),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  githubUrl: z.string().url(),
  blogPost: z.string().optional(),
  techStack: z.array(z.string()),
  status: z.enum(['active', 'complete', 'learning']),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});
