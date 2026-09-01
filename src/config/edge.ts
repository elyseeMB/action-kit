import { Edge } from 'edge.js';
import { vite } from './vite.ts';

export const edge = Edge.create();
edge.mount(new URL('../views', import.meta.url));

edge.global('viteHead', () => vite.getHeadHTML());
