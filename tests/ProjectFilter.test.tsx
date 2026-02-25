import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProjectFilter from '../src/components/ProjectFilter';

const mockProjects = [
  {
    slug: 'active-project',
    title: 'Active Project',
    description: 'A project currently in progress.',
    githubUrl: 'https://github.com/samcopsey/active',
    techStack: ['TypeScript', 'React'],
    status: 'active' as const,
    featured: true,
    sortOrder: 1,
  },
  {
    slug: 'complete-project',
    title: 'Complete Project',
    description: 'A finished project.',
    githubUrl: 'https://github.com/samcopsey/complete',
    techStack: ['Azure OpenAI', 'Azure Functions'],
    status: 'complete' as const,
    featured: false,
    sortOrder: 2,
  },
  {
    slug: 'learning-project',
    title: 'Learning Project',
    description: 'A project for building knowledge.',
    githubUrl: 'https://github.com/samcopsey/learning',
    blogPost: 'my-learning-post',
    techStack: ['Copilot Studio'],
    status: 'learning' as const,
    featured: false,
    sortOrder: 3,
  },
];

describe('ProjectFilter', () => {
  it('renders all projects by default', () => {
    render(<ProjectFilter projects={mockProjects} />);
    expect(screen.getByText('Active Project')).toBeInTheDocument();
    expect(screen.getByText('Complete Project')).toBeInTheDocument();
    expect(screen.getByText('Learning Project')).toBeInTheDocument();
  });

  it('marks the All button as active by default', () => {
    render(<ProjectFilter projects={mockProjects} />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('filters to only active projects', async () => {
    render(<ProjectFilter projects={mockProjects} />);
    await userEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByText('Active Project')).toBeInTheDocument();
    expect(screen.queryByText('Complete Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Learning Project')).not.toBeInTheDocument();
  });

  it('filters to only complete projects', async () => {
    render(<ProjectFilter projects={mockProjects} />);
    await userEvent.click(screen.getByRole('button', { name: 'Complete' }));

    expect(screen.queryByText('Active Project')).not.toBeInTheDocument();
    expect(screen.getByText('Complete Project')).toBeInTheDocument();
    expect(screen.queryByText('Learning Project')).not.toBeInTheDocument();
  });

  it('filters to only learning projects', async () => {
    render(<ProjectFilter projects={mockProjects} />);
    await userEvent.click(screen.getByRole('button', { name: 'Learning' }));

    expect(screen.queryByText('Active Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Complete Project')).not.toBeInTheDocument();
    expect(screen.getByText('Learning Project')).toBeInTheDocument();
  });

  it('returns all projects when All is clicked after filtering', async () => {
    render(<ProjectFilter projects={mockProjects} />);
    await userEvent.click(screen.getByRole('button', { name: 'Complete' }));
    await userEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByText('Active Project')).toBeInTheDocument();
    expect(screen.getByText('Complete Project')).toBeInTheDocument();
    expect(screen.getByText('Learning Project')).toBeInTheDocument();
  });

  it('sets aria-pressed on the newly active filter', async () => {
    render(<ProjectFilter projects={mockProjects} />);
    const btn = screen.getByRole('button', { name: 'Complete' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders tech stack pills', () => {
    render(<ProjectFilter projects={mockProjects} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Azure OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Copilot Studio')).toBeInTheDocument();
  });

  it('renders GitHub links for all projects', () => {
    render(<ProjectFilter projects={mockProjects} />);
    const links = screen.getAllByRole('link', { name: /View on GitHub/i });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', 'https://github.com/samcopsey/active');
  });

  it('renders a blog post link when blogPost is set', () => {
    render(<ProjectFilter projects={mockProjects} />);
    const writeUpLink = screen.getByRole('link', { name: /Read write-up/i });
    expect(writeUpLink).toHaveAttribute('href', '/blog/my-learning-post');
  });

  it('does not render write-up link when blogPost is not set', () => {
    const projectsWithoutBlogPost = mockProjects.filter(p => !p.blogPost);
    render(<ProjectFilter projects={projectsWithoutBlogPost} />);
    expect(screen.queryByRole('link', { name: /Read write-up/i })).not.toBeInTheDocument();
  });

  it('shows empty state message when no projects match', () => {
    render(<ProjectFilter projects={[]} />);
    expect(screen.getByText('No projects found.')).toBeInTheDocument();
  });

  it('renders project descriptions', () => {
    render(<ProjectFilter projects={mockProjects} />);
    expect(screen.getByText('A project currently in progress.')).toBeInTheDocument();
  });
});
