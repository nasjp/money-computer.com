const principles = [
  {
    number: "01",
    title: "明確性",
    description:
      "メッセージを明確に伝えることを最優先とし、装飾的な要素を排除する。",
  },
  {
    number: "02",
    title: "客観性",
    description:
      "個人的な表現よりも、普遍的で客観的なコミュニケーションを重視する。",
  },
  {
    number: "03",
    title: "グリッドシステム",
    description:
      "数学的に構築されたグリッドを基盤とした、論理的なレイアウト設計。",
  },
  {
    number: "04",
    title: "サンセリフ書体",
    description:
      "ヘルベチカやユニヴァースなど、装飾のないサンセリフ書体の使用。",
  },
];

export function Principles() {
  return (
    <section id="principles" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="swiss-grid mb-16">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              基本原則
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <p className="text-lg text-muted-foreground swiss-text leading-relaxed">
              スイス・タイポグラフィを特徴づける4つの基本原則。
              これらの原則は、現代のデザインにおいても重要な指針となっています。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {principles.map((principle) => (
            <div key={principle.number} className="space-y-4">
              <div className="text-6xl font-light text-accent">
                {principle.number}
              </div>
              <h3 className="text-2xl font-medium">{principle.title}</h3>
              <p className="text-muted-foreground swiss-text leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
