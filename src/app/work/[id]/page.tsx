// src/app/work/[id]/page.tsx

export const dynamic = 'force-dynamic';
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

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
    <div className="mx-auto p-4 pt-[100px] flex flex-col items-center justify-start min-h-screen w-full bg-[#0a192f] text-gray-300">
      <motion.div className="flex max-w-[1000px] w-full flex-col justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        {project ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gray-300">{project.title}</h1>
            <p className="text-gray-400 mb-6">{project.description}</p>

            {project.images && (
              <div className="mt-4 mb-10 max-w-3xl w-full mx-auto">
                <ImageGallery
                  items={project.images}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showThumbnails={true}
                  renderItem={(item) => (
                    <div className="image-gallery-image flex flex-col items-center bg-[#0a192f]">
                      <img src={item.original} alt={item.description || 'Ukázka projektu'} className="object-contain max-h-[90vh] w-auto mx-auto bg-[#0a192f]" />
                      {item.description && <div className="absolute bottom-0 left-0 text-sm text-white bg-black bg-opacity-60 p-2 w-full text-center mt-2">{item.description}</div>}
                    </div>
                  )}
                />
              </div>
            )}

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <button className="rounded-lg px-6 py-3 bg-white text-gray-700 font-bold text-lg">Demo</button>
              </a>
              {project.source && (
                <a href={project.source} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-lg px-6 py-3 bg-white text-gray-700 font-bold text-lg">Repo</button>
                </a>
              )}
            </div>
          </>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">Projekt nenalezen</h1>
        )}

        <Link href="/work" className="mt-8">
          <button className="rounded-lg px-6 py-3 bg-pink-600 text-white font-bold text-lg">Zpět na projekty</button>
        </Link>
      </motion.div>
    </div>
  );
}
