// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	base: '/docs-hub/dist/',
	integrations: [
		starlight({
			title: 'Biz Healthcheck Dashboard',
			defaultLocale: 'ko',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			sidebar: [
				{
					label: '프로젝트 문서',
					autogenerate: { directory: 'project' },
				},
				{
					label: 'HTML 문서 (와이어프레임/요청서)',
					autogenerate: { directory: 'html-docs' },
				},
				{
					label: '📂 파일 업로드',
					link: '/html/upload.html',
					attrs: { target: '_blank' },
				},
			],
		}),
	],
});
