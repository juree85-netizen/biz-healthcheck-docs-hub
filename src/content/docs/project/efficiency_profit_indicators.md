---
title: efficiency profit indicators
---

# 효율/수익 지표 정의 및 산출 가능 여부

---

## 1. 상품 분류 및 지표 산출 가능 여부

| 상품 | License Type | Price Type | RC/NRC | LTV | CAC | LTV/CAC | CAC Payback |
|---|---|---|---|:---:|:---:|:---:|:---:|
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

### 범례

| 기호 | 의미 |
|---|---|
| ✅ | 산출 가능 |
| ❌ | 산출 불가 (N/A) |

### 비고

- **EMS / EMS (All)**: Recurring 비중 약 9% (라이선스+운영 149억 / 전체 1,572억), 데이터 분리 불가로 LTV/LTV/CAC/CAC Payback 산출 제외 (CAC만 산출)

---

## 2. 지표별 산식

| 지표 | 대상 | 산식 |
|---|---|---|
| **LTV** | EMS/EMS(All) 제외 전 상품 | `(Recurring 매출 ÷ 이탈률) + (연 일회성 매출 ÷ 고객 수)` ※ 실무 적용 시 vf219 전체 사용 |
| | EMS / EMS (All) | N/A |
| **CAC** | 전체 | `N-2년 sum(vf599) ÷ N-1년 신규 고객 수` |
| **LTV/CAC** | EMS/EMS(All) 제외 전 상품 | `LTV ÷ CAC` |
| | EMS / EMS (All) | N/A |
| **CAC Payback** | EMS/EMS(All) 제외 전 상품 | `(CAC ÷ ARPA) × 12` (단위: 개월) |
| | EMS / EMS (All) | N/A |

---

## 3. 산식 정의 상세

### LTV (Customer Lifetime Value, 고객 생애 가치)

> 고객 1명이 이탈하기 전까지 회사에 가져오는 총 가치

| 항목 | 내용 |
|---|---|
| 산식 | `ARPA ÷ 이탈률` |
| ARPA 정의 | Average Revenue Per Account — `sum(vf219) ÷ 고객 수` ※ 해당 연도 vf219 ≠ 0인 고객 수 기준 |
| R(Revenue) 범위 | **Recurring Revenue (라이선스/기술지원 + 운영)** 기준 ※ RC/NRC 데이터 분리가 어려우므로 실무 적용 시 vf219(매출총계) 전체를 Recurring으로 간주하여 사용 |
| 이탈률 정의 | `(1 - (N-1년 sum(vf219) ÷ N-2년 sum(vf219))) × 100` ※ N-1년 ≥ N-2년이면 이탈률 = 0 |
| 이탈률 = 0일 때 | LTV / LTV/CAC / CAC Payback 모두 빈칸 |
| 표시 주기 | Yearly (2023 / 2024 / 2025) |
| EMS / EMS (All) | N/A ※ Recurring 비중 약 9%, 데이터 분리 불가 |

### CAC (Customer Acquisition Cost, 고객 확보 비용)

> 신규 고객 1명을 확보하는 데 들어간 평균 영업/마케팅 비용

| 항목 | 내용 |
|---|---|
| 산식 | `N-2년 sum(vf599) ÷ N-1년 신규 고객 수` |
| 신규 고객 정의 | `(N-2년 vf219 = 0) & (N-1년 vf219 ≠ 0)` |
| 표시 주기 | Yearly (2023 / 2024 / 2025) |

### LTV/CAC Ratio

> 고객이 평생 창출하는 가치가 확보 비용의 몇 배인지 나타내는 효율 지표

| 항목 | 내용 |
|---|---|
| 산식 | `LTV ÷ CAC` |
| 참고 | 일반적으로 LTV : CAC = 3 : 1이 적정 수준 |

### CAC Payback Period (신규 고객 확보 비용 회수 기간)

> 고객 1명을 확보하기 위해 쓴 CAC를 회수하는 데 걸리는 기간

| 항목 | 내용 |
|---|---|
| 산식 | `(CAC ÷ ARPA) × 12` (단위: 개월) |
| 참고 | B2B SaaS 적정 수준: 12개월 이하 |

---

## 4. 화면 설계 스펙

### 4-1. 전체 페이지 레이아웃

#### 좌측 사이드바

| 항목 | 내용 |
|---|---|
| 배경색 | 딥 네이비 그라데이션 (#1E2A3A ~ #2C3E50) |
| 현재 페이지 표시 | 청록색(#17B9A6) 배경 + 흰색 텍스트 |

**메뉴 구조**

```
사업부 대시보드
사업건전성 현황
사업건전성 영역별 현황 (expand)
  └ 재무 (expand)
      ├ 성장
      ├ 효율/수익  ← 현재 페이지 (하이라이트)
      ├ 시장
      └ 영업
  └ 고객/상품
고객 현황
매출/원가 현황
지표 정보
로그아웃
```

#### 상단 헤더

| 항목 | 내용 |
|---|---|
| 타이틀 | "사업건전성" (좌측) |
| 상품 필터 | 드롭다운 (예: "Brity Automation") — 상단 중앙 |
| 사업 건전성 상태 | "사업 건전성: 양호" (파란색 원 인디케이터) |
| 기준월 | 24년 08월 |
| 업데이트 주기 | 매월 10일 |

#### 메인 컨텐츠 공통

| 항목 | 내용 |
|---|---|
| 배경색 | #F5F5F5 |
| 카드 간격 | 16~20px |
| 레이아웃 | 2칼럼 그리드 |

---

### 4-2. 카드별 스펙

#### Row 1 — Sales Efficiency

**카드 1-1: Gross Sales Efficiency (좌)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 단색 바 차트 |
| 색상 | 라이트 블루 (#90CAF9) |
| 단위 | % (우측 상단 표시) |
| Y축 | 0% ~ 100% |
| X축 | 2022 / 2023 / 2024 |
| 데이터 라벨 | 바 상단 수치 표시 |
| 샘플 데이터 | 2022: 70.2%, 2023: 81.0%, 2024: 81.1% |

**카드 1-2: Net Sales Efficiency (우)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 단색 바 차트 |
| 색상 | 라이트 블루 (#90CAF9) |
| 단위 | % (우측 상단 표시) |
| Y축 | 0% ~ 100% |
| X축 | 2022 / 2023 / 2024 |
| 데이터 라벨 | 바 상단 수치 표시 |
| 샘플 데이터 | 2022: 70.2%, 2023: 81.0%, 2024: 81.1% |

---

#### Row 2 — LTV/CAC 지표

**카드 2-1: CAC / LTV / LTV:CAC Ratio (좌)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 콤비네이션 차트 (더블 바 + 라인) |
| 좌축 | CAC (라이트 블루 #90CAF9), LTV (다크 블루 #1E88E5) — 막대, 단위: 억원 |
| 우축 | LTV/CAC Ratio (오렌지 #FF9800) — 선, 단위: 배수 |
| X축 | 2022 / 2023 / 2024 |
| 샘플 데이터 | 2022: CAC 115억 / LTV 140억 / Ratio 1.6배, 2023: CAC 200억 / LTV 230억 / Ratio 1.9배, 2024: CAC 350억 / LTV 390억 / Ratio 2.1배 |
| 적용 상품 | EMS / EMS(All) 제외 전 상품 |

**산식**

| 지표 | 산식 |
|---|---|
| ARPA | `sum(vf219) ÷ 고객 수` ※ 해당 연도 vf219 ≠ 0인 고객 수, R(Revenue) = Recurring Revenue (라이선스/기술지원 + 운영) 기준, 실무상 vf219 전체 사용 |
| 이탈률 | `(1 - (N-1년 sum(vf219) ÷ N-2년 sum(vf219))) × 100` ※ N-1년 ≥ N-2년이면 0 |
| LTV | `ARPA ÷ 이탈률` |
| CAC | `N-2년 sum(vf599) ÷ N-1년 신규 고객 수` ※ 신규 고객 = N-2년 vf219=0 & N-1년 vf219≠0 |
| LTV:CAC | `LTV ÷ CAC` |

**예외 처리**

| 조건 | 처리 |
|---|---|
| 이탈률 = 0 | LTV / LTV:CAC 빈칸 |
| 신규 고객 수 = 0 | CAC / LTV:CAC 빈칸 |
| EMS / EMS(All) | 카드 미표시 |

**카드 2-2: CAC Payback Period (우)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 라인 차트 |
| 색상 | 퍼플 (#7E57C2) |
| 단위 | 개월 |
| Y축 | 0 ~ 60개월 |
| X축 | 2022 / 2023 / 2024 |
| 데이터 라벨 | 각 포인트에 "N개월" 형식 표시 |
| 샘플 데이터 | 2022: 17개월, 2023: 15개월, 2024: 13개월 |
| 적용 상품 | EMS / EMS(All) 제외 전 상품 |

**산식**

| 지표 | 산식 |
|---|---|
| CAC Payback | `(CAC ÷ ARPA) × 12` (단위: 개월) |

**예외 처리**

| 조건 | 처리 |
|---|---|
| ARPA = 0 | 빈칸 |
| CAC 빈칸인 경우 | 빈칸 |
| EMS / EMS(All) | 빈칸 |

---

#### Row 3 — ARPA 추이

**카드 3-1: ARPA by ACV (좌)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 다중 라인 차트 |
| 라인 ① | Average ACV (오렌지 #FF9800) |
| 라인 ② | Average ACV — New Customers (퍼플 #7E57C2) |
| 단위 | 억원 |
| Y축 | 0.0 ~ 1.4 |
| X축 | 22.4Q ~ 25.3Q (12개 분기) |
| 데이터 라벨 | 시작/끝 포인트 표시 |

**카드 3-2: ARPA by MRR (우)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 다중 라인 차트 |
| 라인 ① | Average MRR (오렌지 #FF9800) |
| 라인 ② | Average MRR — New Customers (퍼플 #7E57C2) |
| 단위 | 천만원 |
| Y축 | 0.0 ~ 0.4 |
| X축 | 22.4Q ~ 25.3Q (12개 분기) |
| 데이터 라벨 | 시작/끝 포인트 표시 |

---

#### Row 4 — 효율 지표

**카드 4-1: Revenue on FTE (좌)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 라인 차트 |
| 색상 | 퍼플 (#7E57C2) |
| 단위 | 억원 |
| Y축 | 0 ~ 4 |
| X축 | 반기 (23.2H / 24.1H / 24.2H / 25.1H) |
| 데이터 라벨 | 시작/끝 포인트 표시 |
| 샘플 데이터 | 23.2H: 3.1, 24.1H: 피크, 25.1H: 2.8 |

**카드 4-2: Rule of 40 (우)**

| 항목 | 내용 |
|---|---|
| 차트 타입 | 다중 라인 차트 (3라인) |
| 라인 ① | Rule of 40 (오렌지 #FF9800) |
| 라인 ② | % ARR Growth YoY Quarterly (퍼플 #7E57C2) |
| 라인 ③ | % Operating Profit Last 12 Months (그레이 #9E9E9E) |
| 단위 | % |
| Y축 | -40% ~ 40% |
| X축 | 22.4Q ~ 25.3Q |
| 데이터 라벨 | 시작/끝 포인트 표시 |

---

#### Row 5 — 수익성 추이 (대형 카드)

**카드 5-1: Revenue & Profit (좌)**

KPI 섹션 (카드 상단)

| KPI | 내용 |
|---|---|
| Revenue | Last Month: 24.4억 (+2.1 vs. Previous Period) |
| Operating Profit | Last Month: -4.4억 (+4.1 vs. Previous Period) |
| 스타일 | 메인 숫자 32~36px, bold, 그라데이션 텍스트 |

차트 섹션

| 항목 | 내용 |
|---|---|
| 차트 타입 | 콤비네이션 차트 (바 + 라인) |
| 바 | Revenue (라이트 블루 #90CAF9) |
| 라인 | Operating Profit (오렌지 #FF9800) |
| 단위 | 억원 |
| Y축 | -20 ~ 60 |
| X축 | 월별 (23.10 ~ 25.10) |
| 데이터 라벨 | 시작/끝 포인트 표시 |

**카드 5-2: % Gross Margin & Operating Profit (우)**

KPI 섹션 (카드 상단)

| KPI | 내용 |
|---|---|
| Gross Margin | Last Month: 28.6% (+13.8% vs. Previous Period) |
| Operating Profit | Last Month: -17.9% (+20.1% vs. Previous Period) |

차트 섹션

| 항목 | 내용 |
|---|---|
| 차트 타입 | 다중 라인 차트 |
| 라인 ① | % Gross Margin (오렌지 #FF9800) |
| 라인 ② | % Operating Profit (퍼플 #7E57C2) |
| 단위 | % |
| Y축 | -60% ~ 80% |
| X축 | 월별 (23.07 ~ 24.07) |
| 데이터 라벨 | 시작/끝 포인트 표시 |

---

#### Row 6 — 목표 대비 실적 (대형 카드)

**카드 6-1: Revenue vs. Plan (좌)**

KPI 섹션 (카드 상단)

| KPI | 내용 |
|---|---|
| Last Month | 24.4억 (-25.3 vs. Plan) |
| YTM | 270.8억 (-145.5 vs. Plan) |

차트 섹션

| 항목 | 내용 |
|---|---|
| 차트 타입 | 트리플 바 차트 |
| 바 ① | 2024 실적 (라이트 블루 #90CAF9) |
| 바 ② | Plan (미디엄 블루 #42A5F5) |
| 바 ③ | 실적/속보 (다크 블루 #1E88E5) |
| 단위 | 억원 |
| 좌측 Y축 | 0 ~ 80 |
| 우측 Y축 | 0% ~ 100% (달성률) |
| X축 | 1월 ~ 7월 |

**카드 6-2: Operating Profit vs. Plan (우)**

KPI 섹션 (카드 상단)

| KPI | 내용 |
|---|---|
| Last Month | -4.4억 (-1.1 vs. Plan) |
| YTM | -11.6억 (-47.9 vs. Plan) |

차트 섹션

| 항목 | 내용 |
|---|---|
| 차트 타입 | 트리플 바 차트 |
| 바 ① | 2024 실적 (라이트 블루 #90CAF9) |
| 바 ② | Plan (미디엄 블루 #42A5F5) |
| 바 ③ | 실적/속보 (다크 블루 #1E88E5) |
| 단위 | 억원 |
| 좌측 Y축 | -20 ~ 20 |
| 우측 Y축 | 0% ~ 4000% (달성률) |
| X축 | 1월 ~ 7월 |

---

### 4-3. 색상 시스템

| 요소 | 색상 코드 |
|---|---|
| 사이드바 네이비 | #1E2A3A ~ #2C3E50 (그라데이션) |
| 현재 페이지 하이라이트 | #17B9A6 (청록색) |
| 라이트 블루 (주요) | #90CAF9 |
| 미디엄 블루 | #42A5F5 |
| 다크 블루 | #1E88E5 |
| 오렌지 | #FF9800 |
| 퍼플 | #7E57C2 |
| 그레이 | #9E9E9E |
| 카드 배경 | #FFFFFF |
| 페이지 배경 | #F5F5F5 |

---

### 4-4. 타이포그래피

| 요소 | 스펙 |
|---|---|
| 카드 타이틀 | 16px, semi-bold, #333 |
| KPI 메인 숫자 | 32~36px, bold |
| KPI 라벨 | 11~12px, regular |
| 차트 라벨 | 10~11px, regular |
| 축 레이블 | 9~10px, regular, #666 |
| 단위 표시 | 10px, light, #999 |

---

### 4-5. 카드 스타일

| 항목 | 값 |
|---|---|
| border-radius | 8~10px |
| 테두리 | 1px solid #E0E0E0 |
| box-shadow | 0 2px 8px rgba(0,0,0,0.08) |
| 내부 패딩 | 20~24px |
| KPI 분리선 | 1px solid #F0F0F0 |
