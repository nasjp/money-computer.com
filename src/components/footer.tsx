export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="container mx-auto">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-6">
            <h3 className="text-2xl font-light tracking-tight mb-4">スイス・タイポグラフィ</h3>
            <p className="text-muted-foreground swiss-text leading-relaxed mb-8">
              機能性と美しさを両立させるデザイン哲学を探求し、 現代のクリエイターに向けて情報を発信しています。
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                プライバシーポリシー
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                利用規約
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                お問い合わせ
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h4 className="font-medium mb-4">カテゴリー</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  書体史
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  レイアウト
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  デザイン理論
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  色彩理論
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h4 className="font-medium mb-4">リソース</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  書籍ガイド
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  フォントコレクション
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  グリッドテンプレート
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  インスピレーション
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="swiss-grid items-center">
            <div className="col-span-12 lg:col-span-6">
              <p className="text-sm text-muted-foreground">© 2025 スイス・タイポグラフィ. All rights reserved.</p>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:text-right">
              <p className="text-sm text-muted-foreground">Form follows function.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
