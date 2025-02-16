import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Test Components</CardTitle>
          <CardDescription>
            Testing shadcn/ui components integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <Button>Click me</Button>
        </CardFooter>
      </Card>
    </main>
  )
}