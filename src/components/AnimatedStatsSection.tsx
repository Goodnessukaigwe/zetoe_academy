'use client';

interface Stat {
  title: string;
  value: number;
  suffix: string;
}

interface AnimatedStatsSectionProps {
  statistics: Stat[];
}

export default function AnimatedStatsSection({ statistics }: AnimatedStatsSectionProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat) => (
            <div key={stat.title} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
                {stat.value}{stat.suffix}
              </div>
              <h3 className="text-gray-700 font-medium">
                {stat.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
