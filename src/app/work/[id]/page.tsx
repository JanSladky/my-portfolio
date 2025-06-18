'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

// Project details
const projectDetails: Record<string, any> = {
  1: {
    title: 'Webové stránky pro kosmetické studio',
    description: 'Tento projekt zahrnoval vytvoření moderního webu pro kosmetické studio.',
    demo: 'https://www.kosmetikapohanka.cz',
    source: 'https://github.com/JanSladky/kosmetika-pohanka-next',
  },
  2: {
    title: 'Webové stránky pro videojinak',
    description: 'Projekt pro videojinak zahrnoval tvorbu webových stránek zaměřených na prezentaci natočených videí pro firmy, svatební páry a tak dále',
    demo: 'https://www.videojinak.cz',
    source: 'https://github.com/JanSladky/videojinak-web',
  },
  3: {
    title: 'Aplikace pro rozdělení hráčů do skupin',
    description: 'Aplikace umí vytvořit hráče, označit je a náhodně rozdělit do skupin.',
    demo: 'https://www.jansladky.eu/randomator',
    source: 'https://gitlab.com/sladky.honza/my-portfolio-website',
  },
  4: {
    title: 'Aplikace pro plánování zasedací místnosti',
    description: 'Zobrazuje události v zasedací místnosti a umožňuje správu v adminu.',
    demo: 'https://zasedacka-display-demo.vercel.app/',
    source: 'https://gitlab.com/sladky.honza/zasedacka-display/-/tree/demo?ref_type=heads',
    images: [
      {
        original: '/projects-img/zasedacka/zasedacka-1.png',
        thumbnail: '/projects-img/zasedacka/zasedacka-1.png',
        description: 'Náhledová public page s přehledem aktuální a nadcházející akce.',
      },
    ],
  },
  5: {
    title: 'Aplikace na recepty',
    description: 'Aplikace pro správu receptů a výpočet kalorií. Frontend v Next.js, backend v Node.js.',
    demo: 'https://recepty-app.vercel.app/',
    source: 'https://github.com/JanSladky/recepty_app',
    images: [
      {
        original: '/projects-img/recepty/recepty-1.png',
        thumbnail: '/projects-img/recepty/recepty-1.png',
        description: 'Titulní strana s vyhledáváním receptu dle klíčových slov nebo kategorií',
      },
    ],
  },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectDetails[id as string];

  return (
    <div className="min-h-screen w-full pt-[120px] pb-20 bg-[#e9f0fb] text-[#1f2937] font-sans antialiased">
      <motion.div
        className="max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {project ? (
          <>
            <div className="bg-white p-8 rounded-xl shadow-md mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{project.title}</h1>
              <p className="text-slate-600 leading-relaxed">{project.description}</p>
            </div>

            {project.images && (
              <div className="mb-12">
                <ImageGallery
                  items={project.images}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showThumbnails={true}
                  renderItem={(item) => (
                    <div className="image-gallery-image flex flex-col items-center bg-[#e9f0fb] rounded-xl shadow overflow-hidden">
                      <img
                        src={item.original}
                        alt={item.description || 'Ukázka projektu'}
                        className="object-contain max-h-[75vh] w-full rounded"
                      />
                      {item.description && (
                        <div className="text-sm text-gray-700 bg-white bg-opacity-80 px-4 py-2 w-full text-center">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <button className="bg-blue-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-blue-200 transition">
                  Zobrazit demo
                </button>
              </a>
              {project.source && (
                <a href={project.source} target="_blank" rel="noopener noreferrer">
                  <button className="bg-blue-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-blue-200 transition">
                    Repozitář
                  </button>
                </a>
              )}
              <Link href="/work">
                <button className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition">
                  Zpět na projekty
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-500">Projekt nenalezen</h1>
            <Link href="/work">
              <button className="mt-6 bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition">
                Zpět na projekty
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}