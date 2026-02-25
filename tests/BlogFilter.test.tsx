import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import BlogFilter from '../src/components/BlogFilter';

const mockPosts = [
  {
    slug: 'agent-post',
    title: 'Agent Building Post',
    description: 'How to build agents in Copilot Studio.',
    pubDate: '2026-02-01T00:00:00.000Z',
    pillar: 'agent-building' as const,
    format: 'how-to',
    tags: ['agents', 'copilot-studio'],
    minutesRead: 3,
  },
  {
    slug: 'leadership-post',
    title: 'Engineering Leadership Post',
    description: 'Leading teams through the AI transition.',
    pubDate: '2026-02-15T00:00:00.000Z',
    pillar: 'engineering-leadership' as const,
    format: 'opinion',
    tags: ['leadership'],
    minutesRead: 5,
  },
  {
    slug: 'sovereign-post',
    title: 'Sovereign AI Post',
    description: 'Building with UK data residency.',
    pubDate: '2026-02-20T00:00:00.000Z',
    pillar: 'sovereign-ai' as const,
    format: 'architecture',
    tags: ['azure', 'sovereign-cloud'],
    minutesRead: 7,
  },
];

describe('BlogFilter', () => {
  it('renders all posts by default', () => {
    render(<BlogFilter posts={mockPosts} />);
    expect(screen.getByText('Agent Building Post')).toBeInTheDocument();
    expect(screen.getByText('Engineering Leadership Post')).toBeInTheDocument();
    expect(screen.getByText('Sovereign AI Post')).toBeInTheDocument();
  });

  it('marks the All button as active by default', () => {
    render(<BlogFilter posts={mockPosts} />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('other filter buttons are not active by default', () => {
    render(<BlogFilter posts={mockPosts} />);
    expect(screen.getByRole('button', { name: 'Agent Building' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Engineering Leadership' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Sovereign AI' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('filters to only agent-building posts', async () => {
    render(<BlogFilter posts={mockPosts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Agent Building' }));

    expect(screen.getByText('Agent Building Post')).toBeInTheDocument();
    expect(screen.queryByText('Engineering Leadership Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Sovereign AI Post')).not.toBeInTheDocument();
  });

  it('filters to only engineering-leadership posts', async () => {
    render(<BlogFilter posts={mockPosts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Engineering Leadership' }));

    expect(screen.queryByText('Agent Building Post')).not.toBeInTheDocument();
    expect(screen.getByText('Engineering Leadership Post')).toBeInTheDocument();
    expect(screen.queryByText('Sovereign AI Post')).not.toBeInTheDocument();
  });

  it('filters to only sovereign-ai posts', async () => {
    render(<BlogFilter posts={mockPosts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Sovereign AI' }));

    expect(screen.queryByText('Agent Building Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Engineering Leadership Post')).not.toBeInTheDocument();
    expect(screen.getByText('Sovereign AI Post')).toBeInTheDocument();
  });

  it('returns all posts when All is clicked after filtering', async () => {
    render(<BlogFilter posts={mockPosts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Agent Building' }));
    await userEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByText('Agent Building Post')).toBeInTheDocument();
    expect(screen.getByText('Engineering Leadership Post')).toBeInTheDocument();
    expect(screen.getByText('Sovereign AI Post')).toBeInTheDocument();
  });

  it('sets aria-pressed on the newly active filter', async () => {
    render(<BlogFilter posts={mockPosts} />);
    const btn = screen.getByRole('button', { name: 'Sovereign AI' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows reading time when provided', () => {
    render(<BlogFilter posts={mockPosts} />);
    expect(screen.getByText('· 3 min read')).toBeInTheDocument();
    expect(screen.getByText('· 5 min read')).toBeInTheDocument();
  });

  it('does not show reading time when not provided', () => {
    const postsWithoutTime = mockPosts.map(({ minutesRead: _, ...p }) => p);
    render(<BlogFilter posts={postsWithoutTime} />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it('shows empty state message when no posts match', async () => {
    render(<BlogFilter posts={[]} />);
    expect(screen.getByText('No posts found.')).toBeInTheDocument();
  });

  it('renders post descriptions', () => {
    render(<BlogFilter posts={mockPosts} />);
    expect(screen.getByText('How to build agents in Copilot Studio.')).toBeInTheDocument();
  });

  it('renders post links pointing to the correct URL', () => {
    render(<BlogFilter posts={mockPosts} />);
    const link = screen.getByRole('link', { name: /Agent Building Post/i });
    expect(link).toHaveAttribute('href', '/blog/agent-post');
  });
});
