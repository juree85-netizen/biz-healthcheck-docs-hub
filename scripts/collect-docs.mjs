import { cp, mkdir, readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const docsBase = join(projectRoot, 'src', 'content', 'docs');
const publicBase = join(projectRoot, 'public', 'html');
const publicFiles = join(projectRoot, 'public', 'files');

// MD 파일별 첨부 파일 매핑 (파일명 → [{label, path}])
const mdAttachments = {
  'voc_interface_request.md': [
    { label: 'Excel 다운로드', file: 'voc_interface_request.xlsx' },
  ],
  'efficiency_profit_indicators.md': [
    { label: 'Excel 다운로드', file: 'efficiency_profit_dev_request.xlsx' },
  ],
};

async function ensureTitle(filePath) {
  let content = await readFile(filePath, 'utf-8');
  const name = basename(filePath);
  const attachments = mdAttachments[name] || [];

  // 첨부 링크 섹션 생성
  const attachSection = attachments.length > 0
    ? '\n\n---\n\n## 첨부 파일\n\n' +
      attachments.map(a => `- [📥 ${a.label}](/files/${a.file})`).join('\n')
    : '';

  if (content.startsWith('---')) {
    // 이미 frontmatter 있음 — 첨부 섹션만 끝에 추가 (중복 방지)
    if (attachSection && !content.includes('## 첨부 파일')) {
      await writeFile(filePath, content + attachSection);
    }
    return;
  }
  const title = basename(filePath, '.md').replace(/_/g, ' ');
  await writeFile(filePath, `---\ntitle: ${title}\n---\n\n${content}${attachSection}`);
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

const htmlLabels = {
  'efficiency_profit_wireframe.html': '효율/수익 와이어프레임',
  'efficiency_profit_dev_request.html': '효율/수익 지표 개발 요청서',
  'voc_dashboard_wireframe.html': 'VoC 대시보드 와이어프레임',
  'voc_dev_request.html': 'VoC 인터페이스 개발 요청서',
};

const xlsxLabels = {
  'efficiency_profit_dev_request.xlsx': '효율/수익 지표 개발 요청서 (Excel)',
};

// HTML 링크 페이지 생성
async function createHtmlIndexPage(htmlFiles, xlsxFiles) {
  const links = htmlFiles
    .map(f => `- [${htmlLabels[basename(f)] || basename(f, '.html')}](/html/${basename(f)})`)
    .join('\n');

  const xlsxLinks = xlsxFiles.length > 0
    ? `\n## 엑셀 파일 다운로드\n\n` + xlsxFiles
        .map(f => `- [${xlsxLabels[basename(f)] || basename(f)}](/files/${basename(f)})`)
        .join('\n')
    : '';

  const content = `---
title: HTML 문서 목록
description: 와이어프레임 및 개발 요청서 HTML 파일 링크
---

아래 링크에서 각 HTML 문서를 열 수 있습니다.

${links}
${xlsxLinks}
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

  // Excel 파일 수집
  await mkdir(publicFiles, { recursive: true });
  const xlsxFiles = [];
  const allEntries = await readdir('/home/ubuntu');
  for (const name of allEntries) {
    if (!name.endsWith('.xlsx')) continue;
    await cp(join('/home/ubuntu', name), join(publicFiles, name));
    xlsxFiles.push(name);
  }

  // HTML 인덱스 페이지 생성
  await createHtmlIndexPage(htmlFiles, xlsxFiles);

  console.log(`✔ MD 파일 수집 완료`);
  console.log(`✔ HTML 파일 ${htmlFiles.length}개 → public/html/`);
  console.log(`✔ Excel 파일 ${xlsxFiles.length}개 → public/files/`);
  console.log(`✔ HTML 인덱스 페이지 생성`);
}

run().catch(e => { console.error(e); process.exit(1); });
