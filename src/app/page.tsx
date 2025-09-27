import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ArticleGrid } from "@/components/article-grid"
import { Principles } from "@/components/principles"
import { Timeline } from "@/components/timeline"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ArticleGrid />
      <Principles />
      <Timeline />
      <Footer />
    </main>
  )
}
