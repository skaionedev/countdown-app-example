import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          columnGap: 16,
          height: 80,
          borderBottom: '1px solid #ccc',
          padding: '0 16px',
          marginBottom: 20
        }}
      >
        <Link href="/">
          <a>active</a>
        </Link>
        <Link href="/inactive">
          <a>inactive</a>
        </Link>
      </div>
      <div style={{
        padding: 16,
      }}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
