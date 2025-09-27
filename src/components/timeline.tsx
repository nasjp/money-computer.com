const timelineEvents = [
  {
    year: "1950",
    title: "スイススタイルの始まり",
    description:
      "バーゼル造形学校でアーミン・ホフマンが新しいタイポグラフィ教育を開始。",
  },
  {
    year: "1957",
    title: "ヘルベチカの誕生",
    description:
      "マックス・ミーディンガーとエドゥアルト・ホフマンがヘルベチカを開発。",
  },
  {
    year: "1961",
    title: "グリッドシステムの体系化",
    description:
      "ヨゼフ・ミューラー＝ブロックマンが『グリッドシステム』を出版。",
  },
  {
    year: "1970",
    title: "国際的な普及",
    description:
      "インターナショナル・タイポグラフィック・スタイルとして世界に広まる。",
  },
  {
    year: "1990",
    title: "デジタル時代への適応",
    description:
      "コンピューターグラフィックスの普及とともに新たな展開を見せる。",
  },
  {
    year: "2024",
    title: "現代への継承",
    description: "ウェブデザインやUIデザインにおいて、その原則が再評価される。",
  },
];

export function Timeline() {
  return (
    <section id="history" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="swiss-grid mb-16">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              歴史的変遷
            </h2>
            <p className="text-muted-foreground swiss-text leading-relaxed">
              1950年代のスイスから始まり、世界のデザインに影響を与え続ける
              スイス・タイポグラフィの歴史を辿ります。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {timelineEvents.map((event, index) => (
            <div key={event.year} className="swiss-grid items-center">
              <div className="col-span-12 md:col-span-2">
                <div className="text-2xl font-light text-accent">
                  {event.year}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h3 className="text-xl font-medium mb-2">{event.title}</h3>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-muted-foreground swiss-text leading-relaxed">
                  {event.description}
                </p>
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="col-span-12 mt-8">
                  <div className="h-px bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
