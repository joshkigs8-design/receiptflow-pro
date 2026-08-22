import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/affiliate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/affiliate"!</div>
}
