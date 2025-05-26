import React from 'react'
import { Outlet } from '@tanstack/react-router'

export function OutletLayout() {
  return (
    <>
      <div className="wrapper">
        <Outlet />
      </div>
    </>
  )
}
