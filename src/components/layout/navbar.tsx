'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Calendar, ClipboardList, Home, LogOut, Settings, User, SlidersHorizontal } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg purdue-gradient flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">ECE Planner</span>
        </Link>

        {/* Public navigation - always visible */}
        <div className="ml-8 hidden md:flex items-center space-x-6">
          {status === 'authenticated' && (
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <span className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
          )}
          <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </span>
          </Link>
          <Link href="/finder" className="text-sm font-medium text-purdue-gold hover:text-foreground transition-colors">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Finder
            </span>
          </Link>
          {status === 'authenticated' && (
            <>
              <Link href="/planner" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Planner
                </span>
              </Link>
              <Link href="/questionnaire" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Preferences
                </span>
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                    {session.user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/questionnaire" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="purdue" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
