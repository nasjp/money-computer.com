"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-medium tracking-tight">スイス・タイポグラフィ</h1>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                記事
              </a>
              <a href="#principles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                原則
              </a>
              <a href="#history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                歴史
              </a>
              <a href="#resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                リソース
              </a>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              検索
            </Button>
            <Button variant="outline" size="sm">
              購読
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-3">
              <a href="#articles" className="text-sm text-muted-foreground hover:text-foreground">
                記事
              </a>
              <a href="#principles" className="text-sm text-muted-foreground hover:text-foreground">
                原則
              </a>
              <a href="#history" className="text-sm text-muted-foreground hover:text-foreground">
                歴史
              </a>
              <a href="#resources" className="text-sm text-muted-foreground hover:text-foreground">
                リソース
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
