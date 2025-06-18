'use client';

interface SectionWaveProps {
  color: string;
  variant?: 'wave' | 'angle' | 'zigzag';
  flip?: boolean;
}

const SectionWave = ({ color, variant = 'angle', flip = false }: SectionWaveProps) => {
  const getSvg = () => {
    switch (variant) {
      case 'angle':
        return (
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className={`w-full h-[100px] ${flip ? 'rotate-180' : ''}`}
          >
            <polygon fill={color} points="0,100 1440,0 1440,100 0,100" />
          </svg>
        );
      case 'wave':
        return (
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className={`w-full h-[100px] ${flip ? 'rotate-180' : ''}`}
          >
            <path
              fill={color}
              d="M0,96L60,85.3C120,75,240,53,360,53.3C480,53,600,75,720,80C840,85,960,75,1080,80C1200,85,1320,107,1380,117.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        );
      case 'zigzag':
        return (
          <svg
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            className={`w-full h-[100px] ${flip ? 'rotate-180' : ''}`}
          >
            <polygon fill={color} points="0,10 10,0 20,10 30,0 40,10 50,0 60,10 70,0 80,10 90,0 100,10 100,10 0,10" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden leading-none relative">
      {getSvg()}
    </div>
  );
};

export default SectionWave;