# Execution Flow Changelog

## 2026-01-09
- Update MARKET_MAKING_FLOW.md state transitions to match actual code
- Fix withdrawal confirmation monitoring documentation with correct Mixin snapshot check
- Add withdrawal timeout (30 minutes) to error handling
- Add comprehensive ui/DESIGN_PATTERN.md with full design system documentation

## 2026-01-12
- Add i18n support to ExchangeSelection and ExchangeCard components
- Refactor trading pair selection UI components to match exchange selection style and follow GEMINI.md guidelines

## 2026-01-13
- Apply agents.md rules to confirmPaymentInfo.svelte: replace uppercase with capitalize, replace h3 with span
- Disable market-making exchange withdrawals during validation; refund instead

## 2026-01-28
- Remove Postgres leftovers and align configs/docs with SQLite
