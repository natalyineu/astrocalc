# AstroCalc: исследование и план реализации

## 1. Продукт
- Статический многоязычный сайт астро-калькуляторов (Astro 5 + astronomy-engine), монетизация рекламой (AdSense).
- Цель: €50/мес ≈ 12 500 просмотров/мес ≈ 420/день (RPM ~€4) ≈ 200-250 визитов/день.
- Ниша перегружена (Cosmopolitan, Astro.com, Co-Star). Шанс: менее конкурентные языки (es, pt, tr, id, ru, de, fr), реальные расчёты, а не только тексты.
- Риск: тонкий шаблонный ИИ-контент. С июня 2025 ручные санкции Google за scaled content abuse; обновление марта 2026 срезало 50-80% кликов у тонких programmatic-сайтов (цифры из блогов, не от Google). Наказывают за отсутствие ценности, не за ИИ как таковой.
- AdSense часто отказывает тонким сайтам: подавать при 30+ проиндексированных качественных страницах.

## 2. План и метрики
| Срок | Действие | Метрика |
|---|---|---|
| Нед. 1 | GitHub Pages, Search Console, sitemap | 99 стр. в индексе |
| Нед. 2-3 | es, pt, ru, de, fr | ~500 стр. |
| Мес. 2 | 20-30 страниц с уникальными расчётами (дата рождения, фаза луны), свой домен (~€12/год) | индексация |
| Мес. 2-3 | 20 ссылок (Reddit, каталоги, Product Hunt) | 20 доменов |
| Мес. 3 | AdSense | 30+ стр. в индексе |
| Мес. 4-6 | Ежедневный гороскоп ×12 | повторные визиты |

Прогноз визитов/день: мес.3 ≈ 20, мес.6 ≈ 100-200, мес.9 ≈ 250-400, мес.12 ≈ 400-600.
Остановка: < 30 кликов/день к месяцу 4 → менять нишу.

## 3. Бюджет
- Домен €12/год, хостинг (GitHub Pages / Cloudflare Pages) €0.
- Тексты ~$10 на 3 месяца (≈1M токенов). За 1M выходных токенов (ориентир, проверять цены): Haiku 5.5 ~$5, DeepSeek V3 ~$1, Gemini Flash-Lite ~$0.4. Разница копеечная; важнее качество редких языков и сохранность `{плейсхолдеров}` (ловит `scripts/check-i18n.mjs`).
- `translate.mjs` сейчас работает только с Anthropic API; можно переделать под OpenRouter (`OPENROUTER_API_KEY`, модель через переменную).

## 4. Существующие репо, скилы, MCP
Скилы Claude Code:
- coreyhaines31/marketingskills (programmatic SEO, ~21k звёзд, акцент на собственных данных): https://claudemarketplaces.com/skills/coreyhaines31/marketingskills/programmatic-seo
- agricidaniel/claude-seo + claude-blog (MIT): https://pasqualepillitteri.it/en/news/5860/claude-seo-claude-blog-open-source-skills
- alirezarezvani/claude-skills: https://claudemarketplaces.com/skills/alirezarezvani/claude-skills/programmatic-seo
- aradotso/marketing-skills (конвейер, мало звёзд): https://claudemarketplaces.com/skills/aradotso/marketing-skills/marketing-pipeline-ai-content-automation

MCP (нужны ключи Google Cloud):
- samalyxx/gsc-seo-mcp (40 инструментов, CTR, быстрые победы): https://mcpservers.org/servers/samalyxx/gsc-seo-mcp
- saurabhsharma2u/search-console-mcp (GSC + Bing + GA4): https://glama.ai/mcp/servers/@saurabhsharma2u/search-console-mcp/blob/1a2f242dcf7382540302f82d805db1a02cfe366c/README.md
- AminForou GSC MCP (базовый): https://enterprisedna.co/directories/mcp/lionkiii-google-searchconsole-mcp

Источники о рисках: https://alexcloudstar.com/blog/programmatic-seo-2026-indie-hackers/ , https://icoda.io/ai/does-google-penalize-ai-content
Данные из каталогов (звёзды, статус) могли устареть.

## 5. Управление контентом
- Системные строки и UI: `src/i18n/locales/<code>.json` (как сейчас).
- Большие объёмы текста (даты, гороскопы): генерируются скриптом в JSON/Markdown-файлы в репо, один файл на язык и семейство страниц. Проверка скриптом, ревью выборочно.
- MDX только для редких авторских длинных статей (блог/гайды).
- Контент всегда в git: история, ревью, откат.
