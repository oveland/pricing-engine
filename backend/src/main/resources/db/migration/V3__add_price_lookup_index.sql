-- Composite index to optimize the price lookup query:
-- Filters by brand_id, product_id, date range, and resolves priority without table scan.
CREATE INDEX IDX_PRICES_LOOKUP
    ON PRICES (BRAND_ID, PRODUCT_ID, START_DATE, END_DATE, PRIORITY DESC);
