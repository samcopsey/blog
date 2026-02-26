import { useState } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  pillar: 'agent-building' | 'engineering-leadership' | 'sovereign-ai' | 'development';
  format: string;
  tags: string[];
  minutesRead?: number;
}

interface Props {
  posts: BlogPost[];
}

const pillarLabels: Record<string, string> = {
  'agent-building': 'Agent Building',
  'engineering-leadership': 'Engineering Leadership',
  'sovereign-ai': 'Sovereign AI',
  'development': 'Development',
};

const pillarStyles: Record<string, { bg: string; text: string }> = {
  'agent-building': { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  'engineering-leadership': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  'sovereign-ai': { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
  'development': { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'agent-building', label: 'Agent Building' },
  { id: 'engineering-leadership', label: 'Engineering Leadership' },
  { id: 'sovereign-ai', label: 'Sovereign AI' },
  { id: 'development', label: 'Development' },
];

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function BlogFilter({ posts }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredPosts =
    activeFilter === 'all' ? posts : posts.filter(p => p.pillar === activeFilter);

  return (
    <div>
      {/* Filter pills */}
      <div
        role="group"
        aria-label="Filter posts by pillar"
        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}
      >
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            aria-pressed={activeFilter === f.id}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              backgroundColor: activeFilter === f.id ? 'var(--accent)' : 'var(--pill-bg)',
              color: activeFilter === f.id ? '#fff' : 'var(--pill-text)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
          gap: '24px',
        }}
      >
        {filteredPosts.map(post => {
          const ps = pillarStyles[post.pillar];
          return (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: 'block',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = '';
                el.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  margin: '0 0 16px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5,
                }}
              >
                {post.description}
              </p>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontWeight: 500,
                    backgroundColor: ps.bg,
                    color: ps.text,
                  }}
                >
                  {pillarLabels[post.pillar]}
                </span>
                <time style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {formatDate(post.pubDate)}
                </time>
                {post.minutesRead && (
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    · {post.minutesRead} min read
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <p
          style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '48px 0',
          }}
        >
          No posts found.
        </p>
      )}
    </div>
  );
}
