import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { Home } from '@/components/Home'

export const Route = createFileRoute('/')({
  component: Home,
})
