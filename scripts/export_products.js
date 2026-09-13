#!/usr/bin/env node

/**
 * Export Products Catalog Script
 * Usage: node scripts/export_products.js [output_path]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = path.resolve(__dirname, '../public/data/products.json');
const outputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : SOURCE_PATH;

if (!fs.existsSync(SOURCE_PATH)) {
  console.error(`Error: Source catalog not found at ${SOURCE_PATH}`);
  process.exit(1);
}

const data = fs.readFileSync(SOURCE_PATH, 'utf-8');
const products = JSON.parse(data);

console.log(`[Export] Catalog contains ${products.length} products.`);
if (outputPath !== SOURCE_PATH) {
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`[Export] Successfully exported to ${outputPath}`);
} else {
  console.log(`[Export] Catalog verified at ${SOURCE_PATH}`);
}
