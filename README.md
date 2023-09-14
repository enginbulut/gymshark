# Gymshark App
It is a simple API that calculate correct packs for an order based on defined packs.

## Requested Algorithm to be applied
Imagine for a moment that one of our product lines ships in various pack sizes:

• 250 Items

• 500 Items

• 1000 Items

• 2000 Items

• 5000 Items

Our customers can order any number of these items through our website, but they will
always only be given complete packs.
1. Only whole packs can be sent. Packs cannot be broken open.
2. Within the constraints of Rule 1 above, send out no more items than necessary to
   fulfil the order.
3. Within the constraints of Rules 1 &amp; 2 above, send out as few packs as possible to
   fulfil each order.

So, for example:

1 Items ordered =>
* Correct number of packs: 1 x 250
* Incorrect number of packs: 1 x 500 – more items than necessary

250 Items ordered =>
* Correct number of packs: 1 x 250
* Incorrect number of packs: 1 x 500 – more items than necessary

251 Items ordered =>
* Correct number of packs: 1 x 500
* Incorrect number of packs: 2 x 500 – more packs than necessary

501 Items ordered =>
* Correct number of packs: 1 x 500 & 1 x 250
* Incorrect number of packs: 1 x 1000 – more items than necessary

12001 Items ordered =>
* Correct number of packs: 2 x 5000 & 1 x 2000 & 1 x 250
* Incorrect number of packs: 3 x 5000 – more items than necessary

Write an application that can calculate the number of packs we need to ship to the customer.
The API must be written in Golang &amp; be usable by a HTTP API (by whichever method you
choose).

Optional:
- Keep your application flexible so that pack sizes can be changed and added and
  removed without having to change the code.
- Create a UI to interact with your API

##  Implementation
* The application contains a golang API and react client. 
* It has 4 tables called `users`, `orders`, `pack_sizes` and `order_items`
* It has role support as `admin` and `user`
  * Admin users can mutate pack sizes and see everyone's orders including himself.
  * Regular users can do everything expect admin role user individual actions, and they can only see their own orders.
  * There is a predefined admin user 
    * email: `admin@test.com`
    * password: `administrator`
  * When you register with a new user its role will be set as `user` automatically
* Authorization mechanism works through JWT tokens.
* The app is dockerized so the only thing you need to is to call `docker compose up` and access `localhost:3000`
* It uses postgresql to persist the data. 
* It uses `sqlc` to generate data layer. And, it uses mockgen to generate dummy database for testing purpose.
* DO NOT FORGET TO ADD PACK SIZE WHEN YOU USE OPEN THE UI BEFORE YOU CREATE THE ORDER.