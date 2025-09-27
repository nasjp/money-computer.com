import { Card } from "@/components/ui/card"

const articles = [
  {
    id: 1,
    title: "ヘルベチカの誕生と影響",
    excerpt: "1957年に誕生したヘルベチカが、現代デザインに与えた革命的な影響について探る。",
    date: "2024年1月15日",
    category: "書体史",
    readTime: "8分",
  },
  {
    id: 2,
    title: "グリッドシステムの原理",
    excerpt: "ヨゼフ・ミューラー＝ブロックマンが確立したグリッドシステムの基本原理と実践方法。",
    date: "2024年1月12日",
    category: "レイアウト",
    readTime: "12分",
  },
  {
    id: 3,
    title: "非対称レイアウトの美学",
    excerpt: "バランスと緊張感を生み出す非対称レイアウトの設計原則とその効果的な使用法。",
    date: "2024年1月10日",
    category: "デザイン理論",
    readTime: "6分",
  },
  {
    id: 4,
    title: "色彩の客観性",
    excerpt: "スイススタイルにおける色彩の使用法：機能性を重視した色彩選択の原則。",
    date: "2024年1月8日",
    category: "色彩理論",
    readTime: "10分",
  },
  {
    id: 5,
    title: "現代への継承",
    excerpt: "デジタル時代におけるスイス・タイポグラフィの原則の応用と進化。",
    date: "2024年1月5日",
    category: "モダンデザイン",
    readTime: "15分",
  },
  {
    id: 6,
    title: "日本のグラフィックデザインへの影響",
    excerpt: "戦後日本のグラフィックデザインがスイススタイルから受けた影響と独自の発展。",
    date: "2024年1月3日",
    category: "日本デザイン史",
    readTime: "11分",
  },
]

export function ArticleGrid() {
  return (
    <section id="articles" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="swiss-grid mb-16">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">最新記事</h2>
            <p className="text-muted-foreground swiss-text">
              スイス・タイポグラフィの原則、歴史、現代への応用について 深く掘り下げた記事をお届けします。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{article.category}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-medium leading-tight swiss-text">{article.title}</h3>
                <p className="text-muted-foreground text-sm swiss-text leading-relaxed">{article.excerpt}</p>
                <div className="text-xs text-muted-foreground">{article.date}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
