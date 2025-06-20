export async function fetchWpPage(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_BASE || 'https://wp.jansladky.eu/wp-json';

  try {
    // Krok 1: Získat ID stránky podle slugu
    const idUrl = `${baseUrl}/wp/v2/pages?slug=${slug}`;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔎 Načítám slug '${slug}': ${idUrl}`);
    }

    const resId = await fetch(idUrl);
    if (!resId.ok) throw new Error(`Chyba při načítání ID: HTTP ${resId.status}`);
    const pages = await resId.json();

    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error(`Stránka '${slug}' nenalezena`);
    }

    const page = pages[0];
    const pageId = page.id;

    // Krok 2: Získat ACF data podle ID
    const acfUrl = `${baseUrl}/acf/v3/pages/${pageId}`;
    const resAcf = await fetch(acfUrl);
    if (!resAcf.ok) throw new Error(`Chyba při načítání ACF: HTTP ${resAcf.status}`);
    const acfData = await resAcf.json();

    return {
      id: pageId,
      title: page.title?.rendered,
      content: page.content?.rendered,
      acf: acfData.acf || {},
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ Chyba při načítání stránky '${slug}':`, error.message);
    }
    return null;
  }
}
