import { describe, it, expect } from 'vitest';
import { blogSchema, projectSchema } from '../src/content/schemas';

// ─── Blog schema ────────────────────────────────────────────────────────────

const validBlog = {
  title: 'Test Post',
  description: 'A test post description.',
  pubDate: '2026-02-25',
  pillar: 'agent-building',
  format: 'how-to',
  tags: ['agents', 'azure'],
  draft: false,
};

describe('blogSchema', () => {
  it('accepts valid frontmatter', () => {
    expect(() => blogSchema.parse(validBlog)).not.toThrow();
  });

  it('rejects missing title', () => {
    const { title: _, ...rest } = validBlog;
    expect(() => blogSchema.parse(rest)).toThrow();
  });

  it('rejects missing description', () => {
    const { description: _, ...rest } = validBlog;
    expect(() => blogSchema.parse(rest)).toThrow();
  });

  it('rejects missing pubDate', () => {
    const { pubDate: _, ...rest } = validBlog;
    expect(() => blogSchema.parse(rest)).toThrow();
  });

  it('coerces pubDate string to a Date instance', () => {
    const result = blogSchema.parse(validBlog);
    expect(result.pubDate).toBeInstanceOf(Date);
  });

  it('rejects an invalid pillar value', () => {
    expect(() => blogSchema.parse({ ...validBlog, pillar: 'random-topic' })).toThrow();
  });

  it('accepts all valid pillar values', () => {
    const pillars = ['agent-building', 'engineering-leadership', 'sovereign-ai'] as const;
    pillars.forEach(pillar => {
      expect(() => blogSchema.parse({ ...validBlog, pillar })).not.toThrow();
    });
  });

  it('rejects an invalid format value', () => {
    expect(() => blogSchema.parse({ ...validBlog, format: 'video' })).toThrow();
  });

  it('accepts all valid format values', () => {
    const formats = ['how-to', 'opinion', 'architecture', 'project-writeup'] as const;
    formats.forEach(format => {
      expect(() => blogSchema.parse({ ...validBlog, format })).not.toThrow();
    });
  });

  it('defaults draft to false when omitted', () => {
    const { draft: _, ...withoutDraft } = validBlog;
    const result = blogSchema.parse(withoutDraft);
    expect(result.draft).toBe(false);
  });

  it('accepts a valid optional githubRepo URL', () => {
    const result = blogSchema.parse({
      ...validBlog,
      githubRepo: 'https://github.com/samcopsey/test',
    });
    expect(result.githubRepo).toBe('https://github.com/samcopsey/test');
  });

  it('rejects a malformed githubRepo value', () => {
    expect(() =>
      blogSchema.parse({ ...validBlog, githubRepo: 'not-a-url' })
    ).toThrow();
  });

  it('accepts an optional heroImage', () => {
    const result = blogSchema.parse({ ...validBlog, heroImage: '/images/hero.png' });
    expect(result.heroImage).toBe('/images/hero.png');
  });
});

// ─── Project schema ──────────────────────────────────────────────────────────

const validProject = {
  title: 'AI Peer Review',
  description: 'A tool for reviewing deliverables.',
  githubUrl: 'https://github.com/samcopsey/ai-peer-review',
  techStack: ['TypeScript', 'Azure OpenAI'],
  status: 'complete',
};

describe('projectSchema', () => {
  it('accepts valid frontmatter', () => {
    expect(() => projectSchema.parse(validProject)).not.toThrow();
  });

  it('rejects missing title', () => {
    const { title: _, ...rest } = validProject;
    expect(() => projectSchema.parse(rest)).toThrow();
  });

  it('rejects missing githubUrl', () => {
    const { githubUrl: _, ...rest } = validProject;
    expect(() => projectSchema.parse(rest)).toThrow();
  });

  it('rejects a malformed githubUrl', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, githubUrl: 'not-a-url' })
    ).toThrow();
  });

  it('rejects an invalid status value', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, status: 'archived' })
    ).toThrow();
  });

  it('accepts all valid status values', () => {
    const statuses = ['active', 'complete', 'learning'] as const;
    statuses.forEach(status => {
      expect(() => projectSchema.parse({ ...validProject, status })).not.toThrow();
    });
  });

  it('defaults featured to false', () => {
    const result = projectSchema.parse(validProject);
    expect(result.featured).toBe(false);
  });

  it('defaults sortOrder to 0', () => {
    const result = projectSchema.parse(validProject);
    expect(result.sortOrder).toBe(0);
  });

  it('accepts an optional blogPost slug', () => {
    const result = projectSchema.parse({
      ...validProject,
      blogPost: 'building-your-first-copilot-studio-agent-uk',
    });
    expect(result.blogPost).toBe('building-your-first-copilot-studio-agent-uk');
  });

  it('rejects an empty techStack', () => {
    // techStack is z.array(z.string()) — empty array is valid, but non-array is not
    expect(() =>
      projectSchema.parse({ ...validProject, techStack: 'TypeScript' })
    ).toThrow();
  });
});
