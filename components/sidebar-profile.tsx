"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function SidebarProfile() {
  return (
    <Card className="h-fit">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback>
              <Image src="/pfp.webp" alt="Profile" width={100} height={100} />
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">Kowy (Pavle) </h2>
            <p className="text-sm text-muted-foreground">
              Full Stack Developer
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/KowyXYZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://linkedin.com/in/kowy-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:kowybusiness@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <Separator />

          <div className="w-full">
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
