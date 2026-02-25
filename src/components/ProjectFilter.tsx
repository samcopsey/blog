import { useState } from 'react';

interface Project {
  slug: string;
  title: string;
  description: string;
  githubUrl: string;
  blogPost?: string;
  techStack: string[];
  status: 'active' | 'complete' | 'learning';
  featured: boolean;
  sortOrder: number;
}

interface Props {
  projects: Project[];
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  active: { dot: '#22c55e', label: 'Active' },
  complete: { dot: '#3b82f6', label: 'Complete' },
  learning: { dot: '#f59e0b', label: 'Learning' },
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'complete', label: 'Complete' },
  { id: 'learning', label: 'Learning' },
];

export default function ProjectFilter({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter(p => p.status === activeFilter);

  return (
    <div>
      {/* Filter pills */}
      <div
        role="group"
        aria-label="Filter projects by status"
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

      {/* Projects grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
          gap: '24px',
        }}
      >
        {filteredProjects.map(project => {
          const sc = statusConfig[project.status];
          return (
            <div
              key={project.slug}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {project.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
                {project.description}
              </p>

              {/* Tech stack pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.techStack.map(tech => (
                  <span
                    key={tech}
                    style={{
                      backgroundColor: 'var(--pill-bg)',
                      color: 'var(--pill-text)',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                      fontSize: '12px',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: sc.dot,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  {sc.label}
                </span>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                  {project.blogPost && (
                    <a
                      href={`/blog/${project.blogPost}`}
                      style={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      Read write-up →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <p
          style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '48px 0',
          }}
        >
          No projects found.
        </p>
      )}
    </div>
  );
}
