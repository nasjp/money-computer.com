export function Hero() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-none tracking-tighter mb-8 swiss-text">
              機能性と美しさの
              <br />
              完璧な調和
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl swiss-text leading-relaxed">
              スイス・タイポグラフィは、明確性、読みやすさ、そして客観的なコミュニケーションを重視する
              デザイン哲学です。グリッドシステムとサンセリフ書体を用いた、
              ミニマルで機能的なアプローチを探求します。
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 flex items-end">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>発祥：1950年代スイス</p>
              <p>別名：インターナショナル・タイポグラフィック・スタイル</p>
              <p>特徴：グリッド、サンセリフ、非対称レイアウト</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
