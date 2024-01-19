<!-- omit in toc -->
# Auto invest design

The design of auto invest in HuFi app
<!-- omit in toc -->
# Summary
- [Frontend](#frontend)
- [Backend](#backend)
- [Data format](#data-format)

## Frontend
  - [ ] Create auto invest
    - [ ] Select asset
    - [ ] Enter amount
    - [ ] Select execution time
  - [ ] Read single auto invest
  - [ ] Read all auto invest
  - [ ] Manage single auto invest
    - [ ] Edit
    - [ ] Stop
    - [ ] Delete
  - [ ] Auto invest account
  - [ ] Auto invest order history
  - [ ] Auto invest yield charts

## Backend
  - [ ] Create an auto invest
  - [ ] Read single auto invest by invest_id
  - [ ] Read all auto invests by user_id
  - [ ] Manage auto invest
    - [ ] Edit by invest_id
    - [ ] Stop by invest_id
    - [ ] Delete by invest_id
  - [ ] Auto invest account along with trading account
  - [ ] Read auto invest order history by user
  - [ ] Read yield data by an auto invest and by user
  - [ ] Message worker (Mixin bot)
    - [ ] Notify user to pay
    - [ ] Send trade detail after payment success
    - [ ] Cancellation of order
  - [ ] Order executor worker
    - [ ] Loop all auto invests, trade at best price at given time

## Data format

New auto invest

```json
{
  name: "My auto invest",                // Name of auto invest, max length 25
  tokens: [
    { asset_id: 'UUID0', amount: 12345 } // Asset id and amount to buy each time
    { asset_id: 'UUID1', amount: 12345 }  
    { asset_id: 'UUID2', amount: 12345 }
  ],
  unit: 'USD',                           // Unit (USD/USDT/CNY/AED/...)
  period: '1d',                          // Period (1d, 1w, 1m, max 12m)
  exec_time: '12:0',                     // (0-23):(0-5), 0-23 means hours, 0-5 means minutes, step=10 mins
  created_at: '2024-04-21T23:42:12Z'     // RFC3339
}
```