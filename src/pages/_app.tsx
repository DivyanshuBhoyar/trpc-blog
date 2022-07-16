import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'

import { AppRouter } from '../server/route/app.router'
import { url } from '../constants'
import { trpc } from '../utils/trpc'
import { UserContextProvider } from '../context/user.context'

function MyApp({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = trpc.useQuery(['users.me'])

  if (isLoading) {
    return <>Loading user...</>
  }

  return (
    <UserContextProvider value={data}>
      <main>
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  )
}

// * configuring trpc with nextjs frontend
export default withTRPC<AppRouter>({
  config({ ctx }) {

    // use links feature to optimize performance
    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ]
    // react-query engine config
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 800,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          }
        }
        return {}
      },
      
      links,
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
