import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';  // Importação ajustada
import { join } from 'path';     // Importação ajustada
import { AppServerModule } from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/test-ssr/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

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

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

