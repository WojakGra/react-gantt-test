import path from 'node:path';
import fs from 'fs-extra';
import { execSync } from 'child_process';

async function generateDts() {
  try {
    execSync('npx tsc --project tsconfig.build.json', { stdio: 'inherit' });
    await fs.copy(
      path.join(process.cwd(), 'package/dist/types/index.d.ts'),
      path.join(process.cwd(), 'package/dist/types/index.d.mts'),
    );
    console.log('✓ Generated TypeScript declarations');
  } catch (err) {
    console.error('Failed to generate d.ts files');
    console.error(err);
    process.exit(1);
  }
}

generateDts();
