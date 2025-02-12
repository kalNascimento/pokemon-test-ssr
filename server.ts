
import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/test-ssr/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Função para pegar pokémons
  async function getPokemons() {
    try {
      let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386&offset=0');
      let data = await response.json();
      return data.results; // Retorna a lista de pokémons
    } catch (err) {
      console.error(err);
      return []; // Retorna uma lista vazia em caso de erro
    }
  }

  // Rota para o sitemap.xml
  server.get("/sitemap.xml", async (req: express.Request, res: express.Response) => {
    try {
      const pokemons = await getPokemons(); // Usando a função getPokemons

      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>https://www.example.com/</loc>
            <lastmod>2025-02-07</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
          </url>`;

      pokemons.forEach((pokemon: { name: string }) => {
        xmlContent += `
          <url>
            <loc>https://www.example.com/pokemon/${pokemon.name}</loc>
            <lastmod>2025-02-07</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>`;
      });

      xmlContent += `</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.end(xmlContent);

    } catch (error) {
      console.error('Erro ao gerar o sitemap:', error);
      res.status(500).send('Erro ao gerar o sitemap.');
    }
  });
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default bootstrap;
