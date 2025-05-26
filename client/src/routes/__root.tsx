import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />

      <div className="wrapper flex justify-center items-center h-screen w-full">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
