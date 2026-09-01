import { readFile } from 'node:fs/promises';
import path from 'node:path';
import express, { type RequestHandler } from 'express';

interface ViteManifestItem {
  file: string;
  isEntry?: boolean;
  css?: string[];
}

type ViteManifest = Record<string, ViteManifestItem>;

export class ViteAssets {
  private readonly publicPath = '/';
  private readonly port = 5173;
  private manifest: ViteManifest | null = null;

  constructor(private readonly assetsPath: string) {}

  private async loadManifest(): Promise<ViteManifest> {
    if (this.manifest) {
      return this.manifest;
    }
    const manifestPath = path.join(this.assetsPath, '.vite', 'manifest.json');
    const content = await readFile(manifestPath, 'utf-8');
    this.manifest = JSON.parse(content) as ViteManifest;
    return this.manifest;
  }

  async getHeadHTML(): Promise<string> {
    if (process.env.NODE_ENV !== 'production') {
      return `
        <script type="module" src="http://localhost:${this.port}/@vite/client"></script>
        <script type="module" src="http://localhost:${this.port}/main.tsx"></script>
      `;
    }

    const manifest = await this.loadManifest();
    const tags: string[] = [];

    for (const item of Object.values(manifest)) {
      if (!item.isEntry) {
        continue;
      }
      tags.push(`<script type="module" src="${this.publicPath}${item.file}"></script>`);
      for (const css of item.css ?? []) {
        console.log(this.publicPath);
        tags.push(`<link rel="stylesheet" href="${this.publicPath}${css}">`);
      }
    }

    return tags.join('\n');
  }

  middleware(): RequestHandler {
    if (process.env.NODE_ENV === 'production') {
      return express.static(this.assetsPath);
    }

    return (req, res) => {
      res.redirect(301, `http://localhost:${this.port}${req.originalUrl}`);
    };
  }
}

export const vite = new ViteAssets(new URL('../dist', import.meta.url).pathname);
