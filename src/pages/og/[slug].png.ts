import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getReadingTime } from '../../utils/reading-time';

// Load assets once at module level
const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/inter-400.woff'));
const fontBold    = readFileSync(join(process.cwd(), 'public/fonts/inter-700.woff'));
const logoBuffer  = readFileSync(join(process.cwd(), 'public/logo.png'));
const logoSrc     = `data:image/png;base64,${logoBuffer.toString('base64')}`;

const pillarMeta: Record<string, { label: string; bg: string; text: string; gradient: string }> = {
  'agent-building':         { label: 'Agent Building',        bg: 'rgba(59,130,246,0.15)',  text: '#3b82f6', gradient: 'linear-gradient(to bottom left, #1e1055 0%, #0e1840 55%, #0a0a0a 100%)' },
  'engineering-leadership': { label: 'Engineering Leadership', bg: 'rgba(34,197,94,0.15)',   text: '#22c55e', gradient: 'linear-gradient(to bottom left, #1e1055 0%, #0e1840 55%, #0a0a0a 100%)' },
  'sovereign-ai':           { label: 'Sovereign AI',           bg: 'rgba(168,85,247,0.15)',  text: '#a855f7', gradient: 'linear-gradient(to bottom left, #1e1055 0%, #0e1840 55%, #0a0a0a 100%)' },
  'development':            { label: 'Development',            bg: 'rgba(249,115,22,0.15)',  text: '#f97316', gradient: 'linear-gradient(to bottom left, #1e1055 0%, #0e1840 55%, #0a0a0a 100%)' },
};

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<'blog'> };
  const { title, description, pubDate, pillar } = post.data;

  const minutesRead   = getReadingTime(post.body);
  const meta          = pillarMeta[pillar] ?? { label: pillar, bg: 'rgba(255,255,255,0.1)', text: '#888888', gradient: 'linear-gradient(to bottom left, #1a1a1a 0%, #0a0a0a 100%)' };
  const shortDesc     = description && description.length > 115
    ? description.slice(0, 112) + '…'
    : (description ?? '');
  const titleFontSize = title.length > 80 ? 44 : title.length > 50 ? 52 : 60;
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(pubDate));

  // Satori requires display:'flex' on every container (it only supports flexbox layout).
  // Cast to `any` — satori accepts plain objects at runtime but its ReactNode type
  // signature requires key:null on every element, which would be very verbose to satisfy.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(
    ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0a0a0a',
          backgroundImage: meta.gradient,
          padding: '64px 80px',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [

          // ── Top row: pillar badge + logo ───────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                marginBottom: '40px',
              },
              children: [
                // Pillar badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: meta.bg,
                      borderRadius: '20px',
                      padding: '8px 18px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: meta.text,
                            flexShrink: 0,
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: meta.text,
                            letterSpacing: '0.02em',
                          },
                          children: meta.label,
                        },
                      },
                    ],
                  },
                },
                // Logo blob clipped to circle
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                    },
                    children: {
                      type: 'img',
                      props: {
                        src: logoSrc,
                        width: 96,
                        height: 96,
                        style: { objectFit: 'cover' },
                      },
                    },
                  },
                },
              ],
            },
          },

          // ── Article title ──────────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleFontSize}px`,
                fontWeight: 700,
                color: '#ededed',
                letterSpacing: '-1.5px',
                lineHeight: '1.1',
                marginBottom: '20px',
                maxWidth: '1000px',
                flexWrap: 'wrap',
              },
              children: title,
            },
          },

          // ── Description ────────────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '22px',
                fontWeight: 400,
                color: '#5a5a5a',
                lineHeight: '1.5',
                maxWidth: '860px',
                flexGrow: 1,
                flexWrap: 'wrap',
                alignContent: 'flex-start',
              },
              children: shortDesc,
            },
          },

          // ── Footer ─────────────────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #1e1e1e',
                paddingTop: '24px',
                marginTop: '24px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '18px', fontWeight: 600, color: '#ededed' },
                    children: 'Sam Copsey',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: '#555555' },
                          children: `${minutesRead} min read`,
                        },
                      },
                      { type: 'span', props: { style: { fontSize: '16px', color: '#2a2a2a' }, children: '·' } },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: '#555555' },
                          children: formattedDate,
                        },
                      },
                      { type: 'span', props: { style: { fontSize: '16px', color: '#2a2a2a' }, children: '·' } },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: '#3b82f6' },
                          children: 'blog.samcopsey.co.uk',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

        ],
      },
    }) as any,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontBold,    weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png   = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
