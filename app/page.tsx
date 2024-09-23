import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  FaLongArrowAltRight,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-8 p-10">
      <section>
        <h1 className="mb-4">Typography</h1>
        <div className="flex flex-col gap-2">
          <h1>This is a heading</h1>
          <p className="max-w-[600px]">
            Normal text: Lorem ipsum dolor, sit amet consectetur adipisicing
            elit. Odio nostrum nulla, id in tenetur, est culpa pariatur quas
            illum.
          </p>
          <p className="max-w-[600px] text-small">
            Small text: Lorem ipsum dolor, sit amet consectetur adipisicing
            elit. Odio nostrum nulla, id in tenetur, est culpa pariatur quas
            illum.
          </p>
          <p className="max-w-[600px] text-small text-foreground_dim">
            Small dimmed text: Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Odio nostrum nulla, id in tenetur, est culpa
            pariatur quas illum.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Basic button</Button>
          <Button>
            Arrow button <FaLongArrowAltRight />
          </Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Form Elements</h2>
        <div className="flex flex-col gap-4 max-w-md">
          <Input type="text" placeholder="Enter your name" />
          <Textarea placeholder="Tell us about yourself" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a mentor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentor1">John Doe</SelectItem>
              <SelectItem value="mentor2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <label htmlFor="notifications">Enable notifications</label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Profile</CardTitle>
              <CardDescription>
                View mentor details and book a session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Mentor" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-small text-foreground_dim">
                    Blockchain Expert
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Book Session</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Session</CardTitle>
              <CardDescription>Your next mentoring session</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Smart Contract Development with Jane Smith</p>
              <p className="text-small text-foreground_dim">
                Tomorrow, 3:00 PM
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Join Session</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Badges</h2>
        <div className="flex gap-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Featured</Badge>
          <Badge variant="outline">Mentor</Badge>
        </div>
      </section>
    </div>
  )
}
