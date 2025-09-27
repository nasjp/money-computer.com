import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function HelveticaLegacyArticle() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Link>
        </nav>

        <header className="mb-12 border-b border-border pb-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-sm mb-4">
              タイポグラフィ史
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tight mb-6 text-balance">
            ヘルベチカの遺産：
            <br />
            スイスタイポグラフィが
            <br />
            現代デザインに与えた影響
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>田中 美穂</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>2024年3月15日</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>8分で読める</span>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="space-y-8">
                <section>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    1957年、マックス・ミーディンガーとエドゥアルト・ホフマンによって生み出されたヘルベチカは、
                    単なる書体を超えて、現代デザインの基盤となる哲学を体現している。
                  </p>

                  <p className="leading-relaxed mb-6">
                    スイス・タイポグラフィの核心にあるのは、装飾を排除し、情報の明確な伝達を最優先とする姿勢である。
                    ヘルベチカはこの理念を完璧に具現化した書体として、世界中のデザイナーに愛用され続けている。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-light mb-6 border-l-2 border-foreground pl-4">
                    客観性への追求
                  </h2>

                  <p className="leading-relaxed mb-6">
                    ヘルベチカの最大の特徴は、その「透明性」にある。文字そのものが主張することなく、
                    メッセージを純粋に伝達する媒体として機能する。これは、スイス・タイポグラフィが
                    目指した「客観的コミュニケーション」の理想的な実現形といえる。
                  </p>

                  <blockquote className="border-l-4 border-muted pl-6 py-4 my-8 bg-muted/30">
                    <p className="text-lg italic leading-relaxed">
                      「良いタイポグラフィは見えないものである。それは読み手の注意を文字から内容へと導く。」
                    </p>
                    <cite className="text-sm text-muted-foreground mt-2 block">
                      — ヤン・チヒョルト
                    </cite>
                  </blockquote>
                </section>

                <section>
                  <h2 className="text-2xl font-light mb-6 border-l-2 border-foreground pl-4">
                    グリッドシステムとの調和
                  </h2>

                  <p className="leading-relaxed mb-6">
                    ヘルベチカの成功は、同時期に発展したグリッドシステムとの完璧な調和にもある。
                    ヨゼフ・ミューラー＝ブロックマンが提唱したグリッドシステムは、ヘルベチカの
                    幾何学的な美しさを最大限に活かす枠組みを提供した。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-light mb-6 border-l-2 border-foreground pl-4">
                    現代への影響
                  </h2>

                  <p className="leading-relaxed mb-6">
                    今日のデジタルデザインにおいても、ヘルベチカの影響は色濃く残っている。
                    AppleのSan Francisco、GoogleのRoboto、MicrosoftのSegoe
                    UIなど、
                    主要なテクノロジー企業の書体は、すべてヘルベチカの遺伝子を受け継いでいる。
                  </p>

                  <div className="bg-muted/50 p-6 rounded-sm my-8">
                    <h3 className="text-lg font-medium mb-4">
                      ヘルベチカの特徴
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• 高いx-height（小文字の高さ）による優れた可読性</li>
                      <li>• 均一な文字幅による整然とした印象</li>
                      <li>• 装飾的要素の完全な排除</li>
                      <li>• 多様なウェイト展開による柔軟性</li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-8 space-y-8">
                <div className="border border-border p-6 rounded-sm">
                  <h3 className="text-lg font-medium mb-4">関連記事</h3>
                  <div className="space-y-4">
                    <article className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-medium mb-2 leading-tight">
                        グリッドシステムの基本原理
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        ヨゼフ・ミューラー＝ブロックマンの理論
                      </p>
                    </article>
                    <article className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-medium mb-2 leading-tight">
                        バウハウスとスイススタイル
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        機能主義デザインの系譜
                      </p>
                    </article>
                    <article>
                      <h4 className="text-sm font-medium mb-2 leading-tight">
                        現代UIデザインへの影響
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        デジタル時代のタイポグラフィ
                      </p>
                    </article>
                  </div>
                </div>

                <div className="border border-border p-6 rounded-sm">
                  <h3 className="text-lg font-medium mb-4">著者について</h3>
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full"></div>
                    <div>
                      <h4 className="font-medium">田中 美穂</h4>
                      <p className="text-sm text-muted-foreground">
                        タイポグラフィ研究者、武蔵野美術大学准教授
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-sm">
                ヘルベチカ
              </span>
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-sm">
                スイスタイポグラフィ
              </span>
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-sm">
                デザイン史
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                共有
              </Button>
              <Button variant="outline" size="sm">
                保存
              </Button>
            </div>
          </div>
        </footer>
      </article>

      <Footer />
    </main>
  );
}
