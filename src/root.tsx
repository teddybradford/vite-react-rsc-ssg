import './root.css'
import { Counter } from './counter'

async function getPages() {
  let glob = import.meta.glob('./pages/*.{mdx,tsx}', { eager: true })
  glob = Object.fromEntries(
    Object.entries(glob).map(([k, v]) => [
      k.substring('./pages'.length, k.lastIndexOf('.')),
      v,
    ]),
  )
  return glob
}

export async function getStaticPaths() {
  const pages = await getPages()
  return ['/', ...Object.keys(pages)]
}

export async function Root({ url }: { url: URL }) {
  const pages = await getPages()

  async function RootContent() {
    if (url.pathname === '/') {
      return (
        <ul>
          {Object.entries(pages).map(([key, value]) => (
            <li key={key}>
              <a href={key} style={{ textTransform: 'capitalize' }}>
                {(value as any).title ?? key.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    const module = pages[url.pathname]
    if (!!module) {
      const Component = (module as any).default
      return <Component />
    }

    // TODO: how to 404?
    return <p>Not found</p>
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RSC MDX SSG</title>
      </head>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <a href="/">RSC + MDX + SSG</a>
          </h1>
          <Counter />
          <span data-testid="timestamp">
            Rendered at {new Date().toISOString()}
          </span>
        </header>
        <main>
          <RootContent />
        </main>
      </body>
    </html>
  )
}
