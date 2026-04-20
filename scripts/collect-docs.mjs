import { cp, mkdir, readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const docsBase = join(projectRoot, 'src', 'content', 'docs');
const publicBase = join(projectRoot, 'public', 'html');

async function ensureTitle(filePath) {
  const content = await readFile(filePath, 'utf-8');
  if (content.startsWith('---')) return;
  const name = basename(filePath, '.md').replace(/_/g, ' ');
  await writeFile(filePath, `---\ntitle: ${name}\n---\n\n${content}`);
}

async function ensureTitlesInDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await ensureTitlesInDir(full);
    else if (e.name.endsWith('.md')) await ensureTitle(full);
  }
}

// MD 파일 소스
const mdSources = [
  {
    src: '/home/ubuntu',
    dest: join(docsBase, 'project'),
    label: '프로젝트 문서',
    ext: '.md',
  },
];

// HTML 파일 소스 (public/html 에 복사)
const htmlSources = [
  {
    src: '/home/ubuntu',
    dest: publicBase,
    ext: '.html',
  },
];

// HTML 링크 페이지 생성
async function createHtmlIndexPage(htmlFiles) {
  const links = htmlFiles
    .map(f => `- [${basename(f, '.html')}](/html/${basename(f)})`)
    .join('\n');
  const content = `---
title: HTML 문서 목록
description: 와이어프레임 및 개발 요청서 HTML 파일 링크
---

아래 링크에서 각 HTML 문서를 열 수 있습니다.

${links}
`;
  const indexDir = join(docsBase, 'html-docs');
  await mkdir(indexDir, { recursive: true });
  await writeFile(join(indexDir, 'index.md'), content);
}

async function run() {
  // MD 파일 수집
  for (const source of mdSources) {
    await mkdir(source.dest, { recursive: true });
    const entries = await readdir(source.src);
    for (const name of entries) {
      if (!name.endsWith(source.ext)) continue;
      await cp(join(source.src, name), join(source.dest, name));
    }
    await ensureTitlesInDir(source.dest);
  }

  // HTML 파일 수집
  await mkdir(publicBase, { recursive: true });
  const htmlFiles = [];
  for (const source of htmlSources) {
    const entries = await readdir(source.src);
    for (const name of entries) {
      if (!name.endsWith(source.ext)) continue;
      await cp(join(source.src, name), join(source.dest, name));
      htmlFiles.push(name);
    }
  }

  // HTML 인덱스 페이지 생성
  await createHtmlIndexPage(htmlFiles);

  console.log(`✔ MD 파일 수집 완료`);
  console.log(`✔ HTML 파일 ${htmlFiles.length}개 → public/html/`);
  console.log(`✔ HTML 인덱스 페이지 생성`);
}

run().catch(e => { console.error(e); process.exit(1); });
