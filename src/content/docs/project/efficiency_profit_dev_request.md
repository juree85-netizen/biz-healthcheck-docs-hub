---
title: 효율/수익 지표 개발 요청서
---

> 대상 시스템: SDSC | 작성: 솔루션사업부 기획팀 | 작성일: 2026-04-20 | v0.3

---

## 1. 요청 배경

사업건전성 대시보드의 **효율/수익 영역** 지표 산출 로직 개발을 요청합니다.

- 원천 데이터: `l_sap.orderlist.vf219` (매출총계), `l_sap.orderlist.vf599` (영업/마케팅 비용) — 당사 DB 기 수신
- Row 1~6 화면은 Tableau로 기 구현되어 있으며, 본 요청서의 개발 범위에서 제외

---

## 2. 요청 사항 요약

| 구분 | 내용 |
|------|------|
| 신규 산출 로직 | ARPA · 이탈률 · LTV · CAC · LTV:CAC · CAC Payback |
| 마스터 데이터 | 상품 필터용 상품 목록 제공 요청 |
| 화면 | Tableau 기 구현 — 본 요청 범위 제외 (와이어프레임 별도 제공 예정) |

---

## 3. 상품 분류 및 지표 산출 가능 여부

| 상품 | License Type | Price Type | RC/NRC | LTV | CAC | LTV/CAC | CAC Payback |
|------|-------------|------------|--------|:---:|:---:|:-------:|:-----------:|
| ZTM | Term | Fixed | RC | ✅ | ✅ | ✅ | ✅ |
| Nexprime SCM | Term | Fixed | RC | ✅ | ✅ | ✅ | ✅ |
| Nexprime SCM Mobile | Term | Fixed | RC | ✅ | ✅ | ✅ | ✅ |
| Nexprime SCM (All) | Term | Fixed | RC | ✅ | ✅ | ✅ | ✅ |
| Nexprime HCM | Term | Fixed | RC | ✅ | ✅ | ✅ | ✅ |
| Knox Portal | Term | Usage | RC | ✅ | ✅ | ✅ | ✅ |
| Knox Meeting | Term | Usage | RC | ✅ | ✅ | ✅ | ✅ |
| Knox EFSS/Drive | Term | Usage | RC | ✅ | ✅ | ✅ | ✅ |
| Knox (All) | Term | Usage | RC | ✅ | ✅ | ✅ | ✅ |
| EMM Cloud | Term | Usage | RC | ✅ | ✅ | ✅ | ✅ |
| Brity Automation | Term+Perpetual | Fixed+One-time | RC+Non-RC | ✅ | ✅ | ✅ | ✅ |
| EMS | Term+Perpetual | Fixed+One-time | RC+Non-RC | ❌ | ✅ | ❌ | ❌ |
| EMS (All) | Term+Perpetual | Fixed+One-time | RC+Non-RC | ❌ | ✅ | ❌ | ❌ |

> ※ EMS / EMS(All): Recurring 비중 약 9% (라이선스+운영 149억 / 전체 1,572억), 데이터 분리 불가로 LTV · LTV:CAC · CAC Payback 산출 제외. CAC만 산출.

---

## 4. 지표별 산출 기준

### 4-1. ARPA (Average Revenue Per Account)

| 항목 | 내용 |
|------|------|
| 산식 | `sum(l_sap.orderlist.vf219) ÷ 고객 수` |
| 고객 수 기준 | 해당 연도 vf219 ≠ 0인 고객 수 |
| Revenue 범위 | vf219 전체 (RC/NRC 분리 불가로 전체를 Recurring으로 간주) |
| 표시 주기 | Yearly (2023 / 2024 / 2025) |

### 4-2. 이탈률 (Churn Rate)

| 항목 | 내용 |
|------|------|
| 산식 | `(1 - (N-1년 sum(vf219) ÷ N-2년 sum(vf219))) × 100` |
| 예외 | N-1년 ≥ N-2년이면 이탈률 = 0 |
| 이탈률 = 0일 때 | LTV · LTV:CAC · CAC Payback 모두 빈칸 표시 |

### 4-3. LTV (Customer Lifetime Value)

| 항목 | 내용 |
|------|------|
| 산식 (이론) | `(Recurring 매출 ÷ 이탈률) + (연 일회성 매출 ÷ 고객 수)` |
| 실무 적용 산식 | `(sum(l_sap.orderlist.vf219) ÷ 이탈률) + (연 일회성 매출 ÷ 고객 수)` |
| 비고 | RC/NRC 데이터 분리 불가로 vf219 전체를 Recurring으로 간주 |
| 적용 상품 | EMS / EMS(All) 제외 전 상품 |
| 표시 주기 | Yearly (2023 / 2024 / 2025) |
| 단위 | 억원 |

### 4-4. CAC (Customer Acquisition Cost)

| 항목 | 내용 |
|------|------|
| 산식 | `N-2년 sum(l_sap.orderlist.vf599) ÷ N-1년 신규 고객 수` |
| 신규 고객 정의 | N-2년 vf219 = 0 **AND** N-1년 vf219 ≠ 0 |
| 적용 상품 | 전체 (EMS 포함) |
| 표시 주기 | Yearly (2023 / 2024 / 2025) |
| 단위 | 억원 |
| 예외 | 신규 고객 수 = 0이면 빈칸 |

### 4-5. LTV:CAC Ratio

| 항목 | 내용 |
|------|------|
| 산식 | `LTV ÷ CAC` |
| 적용 상품 | EMS / EMS(All) 제외 전 상품 |
| 단위 | 배수 (예: 1.6배) |
| 참고 기준 | LTV : CAC = 3 : 1이 적정 수준 |
| 예외 | LTV 또는 CAC 빈칸이면 빈칸 |

### 4-6. CAC Payback Period

| 항목 | 내용 |
|------|------|
| 산식 | `(CAC ÷ ARPA) × 12` |
| 단위 | 개월 |
| 적용 상품 | EMS / EMS(All) 제외 전 상품 |
| 참고 기준 | B2B SaaS 적정 수준: 12개월 이하 |
| 예외 | ARPA = 0 또는 CAC 빈칸이면 빈칸 |

---

> ※ 아래 4-7 ~ 4-11은 **개발 요청 사항이 아닌 참고 자료**입니다. Tableau에 기 적용된 산식을 기록한 것으로, 화면 개발 범위에서 제외됩니다.

### 4-7. [참고] Row 1 — Sales Efficiency

| 항목 | Gross Sales Efficiency | Net Sales Efficiency |
|------|----------------------|---------------------|
| 산식 | `당 분기 총 신규 ARR ÷ 전 분기 영업/마케팅 비용` | `당 분기 Net New ARR ÷ 전 분기 영업/마케팅 비용` |
| 분자 | New ARR + Expansion ARR | 당기 ARR − 전기 ARR |
| 분모 | `l_sap.orderlist.vf599` (전 분기) | 동일 |
| 집계 주기 | 분기별 (22.4Q ~ 25.3Q) | 동일 |
| 단위 | 배수 | 동일 |
| 적정 수준 | 0.8 ~ 1.2 | 0.6 ~ 0.8 |

### 4-8. [참고] Row 3 — ARPA 추이

| 항목 | ARPA by ACV | ARPA by MRR |
|------|------------|------------|
| 산식 | `ACV 총합 ÷ 총 고객 수` | `MRR ÷ 총 유료 고객사 수` |
| 집계 주기 | 분기별 (22.4Q ~ 25.3Q) | 동일 |
| 단위 | 억원 | 천만원 |

### 4-9. [참고] Row 4 — 효율 지표

| 항목 | Revenue on FTE | Rule of 40 |
|------|---------------|-----------|
| 산식 | `Revenue ÷ FTE 수` | `% ARR Growth YoY + EBITDA 마진` |
| 집계 주기 | 반기 | 분기별 (22.4Q ~ 25.3Q) |
| 단위 | 억원/명 | % |
| 적정 수준 | — | 40% 이상 |

### 4-10. [참고] Row 5 — 수익성 추이

| 항목 | Revenue & Operating Profit | % Gross Margin & % Operating Margin |
|------|--------------------------|-------------------------------------|
| 산식 | 절대값 표시 (기존 BI 로직 준용) | Gross Margin = `(매출−직접원가−간접원가) ÷ 매출 × 100` |
| 집계 주기 | 월별 (2023.10 ~ 2025.10) | 동일 |
| 단위 | 억원 | % |

### 4-11. [참고] Row 6 — 목표 대비 실적

| 항목 | Revenue vs. Plan | Operating Profit vs. Plan |
|------|-----------------|--------------------------|
| 산식 | `실적 Revenue ÷ Plan Revenue × 100` | `실적 OP ÷ Plan OP × 100` |
| 집계 주기 | 월별 (해당 연도 1~7월) | 동일 |
| 단위 | 억원 / % (달성률) | 동일 |

---

## 5. 예외 처리 기준 (공통)

| 조건 | 처리 방식 | 영향 지표 |
|------|----------|----------|
| 이탈률 = 0 | 빈칸 표시 | LTV · LTV:CAC · CAC Payback |
| 신규 고객 수 = 0 | 빈칸 표시 | CAC · LTV:CAC · CAC Payback |
| ARPA = 0 | 빈칸 표시 | CAC Payback |
| EMS / EMS(All) 선택 시 | N/A 표시 | Row 2 전체 (LTV · LTV:CAC · CAC Payback) |

---

## 6. 화면 스펙 (참고)

> ※ 화면은 Tableau 기 구현 범위이며, 와이어프레임으로 별도 제공 예정입니다.

### 6-1. 전체 레이아웃

| 항목 | 내용 |
|------|------|
| 구성 | 6 Row × 2 카드 (총 12 카드) |
| 상단 필터 | 상품 드롭다운 (전체 / 상품별 선택) |
| 페이지 배경 | `#F5F5F5` |
| 카드 간격 | 16~20px |

**사이드바**

| 항목 | 내용 |
|------|------|
| 배경 | `#1E2A3A → #2C3E50` (그라데이션) |
| 현재 페이지 | `#17B9A6` 배경 + 흰색 텍스트 |
| 메뉴 경로 | 사업건전성 영역별 현황 > 재무 > **효율/수익** |

### 6-2. Row별 카드 스펙

| Row | 카드 (좌) | 카드 (우) | 차트 타입 | X축 | Y축 범위 |
|-----|----------|----------|----------|-----|---------|
| 1 | Gross Sales Efficiency | Net Sales Efficiency | 단색 바 | 연도 | 0~100% |
| 2 | CAC / LTV / LTV:CAC | CAC Payback Period | 콤비네이션 / 라인 | 연도 | 억원+배수 / 0~60개월 |
| 3 | ARPA by ACV | ARPA by MRR | 다중 라인 | 22.4Q~25.3Q | 0~1.4억 / 0~0.4천만 |
| 4 | Revenue on FTE | Rule of 40 | 라인 / 다중 라인 | 반기 / 분기 | 0~4억 / -40~40% |
| 5 | Revenue & Op.Profit | % Gross / Op. Margin | 콤비네이션 / 다중 라인 | 월별 | -20~60억 / -60~80% |
| 6 | Revenue vs. Plan | Op.Profit vs. Plan | 트리플 바+달성률 라인 | 월별 | 0~80억 / -20~20억 |

### 6-3. 색상 시스템

| 요소 | 색상 |
|------|------|
| 라이트 블루 (주요 바) | `#90CAF9` |
| 미디엄 블루 | `#42A5F5` |
| 다크 블루 | `#1E88E5` |
| 오렌지 (라인/YoY) | `#FF9800` |
| 퍼플 | `#7E57C2` |
| 그레이 | `#9E9E9E` |
| 사이드바 배경 | `#1E2A3A ~ #2C3E50` |
| 현재 페이지 하이라이트 | `#17B9A6` |

### 6-4. 타이포그래피

| 요소 | 스펙 |
|------|------|
| 카드 타이틀 | 16px · semi-bold · `#333` |
| KPI 메인 숫자 | 32~36px · bold · 그라데이션 텍스트 |
| KPI 라벨 | 11~12px · regular |
| 차트 데이터 라벨 | 10~11px · regular |
| 축 레이블 | 9~10px · regular · `#666` |
| 단위 표시 | 10px · light · `#999` |

### 6-5. 카드 스타일

| 항목 | 값 |
|------|---|
| border-radius | 8~10px |
| 테두리 | 1px solid `#E0E0E0` |
| box-shadow | 0 2px 8px rgba(0,0,0,0.08) |
| 내부 패딩 | 20~24px |
| KPI–차트 분리선 | 1px solid `#F0F0F0` |

---

## 7. 문의처

| 항목 | 내용 |
|------|------|
| 담당자 | 미정 |
| 부서 | 솔루션사업부 기획팀 |
| 연락처 | 미정 |


---

## 첨부 파일

- [📥 Excel 다운로드](/files/efficiency_profit_dev_request.xlsx)