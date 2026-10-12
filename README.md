# NullTrap

Practice problems for real data engineering work, in SQL and PySpark.

**Site: https://rishikesh8pandey.github.io/data-engineering-practice/**

Every problem comes from something that goes wrong in real pipelines: duplicates,
late-arriving data, NULLs in the wrong place, joins that multiply rows, windows that
count the wrong thing. Each one has a small synthetic dataset with the awkward cases
planted in it, and a check that tells you whether your result is right without
showing you the answer.

## How to use it

1. Pick a problem below and read the statement on the site.
2. Solve it. The 19 SQL problems can be solved in the browser, with nothing to
   install. Every problem also has a Google Colab notebook, which needs a Google
   account and nothing else.
3. Run the check. It compares a fingerprint of your result with the expected one and
   gives a hint when they differ: a missing column, a wrong row count, the column
   whose values are off.
4. Read the explanation on the problem page: the approach, the common wrong answers
   and why they are wrong.

## Problems

40 problems: 19 SQL, 11 PySpark, 10 Debug the AI.

| # | Problem | Track | Difficulty | Notebook |
|---|---|---|---|---|
| 1 | [Revenue per customer is higher than the ledger](https://rishikesh8pandey.github.io/data-engineering-practice/problems/orders-payments-join/) | Debug the AI | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/001-orders-payments-join.ipynb) |
| 2 | [Keep the latest record per customer](https://rishikesh8pandey.github.io/data-engineering-practice/problems/latest-record-per-customer/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/002-latest-record-per-customer.ipynb) |
| 3 | [The incremental load that loses late events](https://rishikesh8pandey.github.io/data-engineering-practice/problems/incremental-load-late-events/) | PySpark | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/003-incremental-load-late-events.ipynb) |
| 4 | [Build SCD2 history from repeated saves](https://rishikesh8pandey.github.io/data-engineering-practice/problems/scd2-history-from-saves/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/004-scd2-history-from-saves.ipynb) |
| 5 | [The running balance that jumps ahead](https://rishikesh8pandey.github.io/data-engineering-practice/problems/running-balance-tied-dates/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/005-running-balance-tied-dates.ipynb) |
| 6 | [A data quality report that counts NULLs correctly](https://rishikesh8pandey.github.io/data-engineering-practice/problems/data-quality-report/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/006-data-quality-report.ipynb) |
| 7 | [Sessionize page views with a 30-minute gap](https://rishikesh8pandey.github.io/data-engineering-practice/problems/sessionize-page-views/) | PySpark | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/007-sessionize-page-views.ipynb) |
| 8 | [The union that swaps two columns](https://rishikesh8pandey.github.io/data-engineering-practice/problems/union-swapped-columns/) | Debug the AI | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/008-union-swapped-columns.ipynb) |
| 9 | [Merge overlapping coverage periods](https://rishikesh8pandey.github.io/data-engineering-practice/problems/merge-overlapping-periods/) | SQL | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/009-merge-overlapping-periods.ipynb) |
| 10 | [Convert each transaction with the rate valid at the time](https://rishikesh8pandey.github.io/data-engineering-practice/problems/asof-exchange-rate-join/) | PySpark | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/010-asof-exchange-rate-join.ipynb) |
| 11 | [Top three products per category, ties included](https://rishikesh8pandey.github.io/data-engineering-practice/problems/top-products-with-ties/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/011-top-products-with-ties.ipynb) |
| 12 | [The average rating where NULL is not zero](https://rishikesh8pandey.github.io/data-engineering-practice/problems/average-rating-nulls/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/012-average-rating-nulls.ipynb) |
| 13 | [The LEFT JOIN that a WHERE clause quietly undoes](https://rishikesh8pandey.github.io/data-engineering-practice/problems/left-join-where-filter/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/013-left-join-where-filter.ipynb) |
| 14 | [The daily report that is five and a half hours off](https://rishikesh8pandey.github.io/data-engineering-practice/problems/utc-dates-in-india-report/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/014-utc-dates-in-india-report.ipynb) |
| 15 | [Daily revenue with the missing days filled in](https://rishikesh8pandey.github.io/data-engineering-practice/problems/daily-revenue-missing-days/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/015-daily-revenue-missing-days.ipynb) |
| 16 | [Month-over-month change when a month is missing](https://rishikesh8pandey.github.io/data-engineering-practice/problems/month-over-month-gaps/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/016-month-over-month-gaps.ipynb) |
| 17 | [Order totals that grow after explode](https://rishikesh8pandey.github.io/data-engineering-practice/problems/explode-double-count/) | PySpark | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/017-explode-double-count.ipynb) |
| 18 | [The regions that sold nothing, according to the join](https://rishikesh8pandey.github.io/data-engineering-practice/problems/join-on-nullable-key/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/018-join-on-nullable-key.ipynb) |
| 19 | [Which tier was the customer in when they ordered?](https://rishikesh8pandey.github.io/data-engineering-practice/problems/scd2-point-in-time-lookup/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/019-scd2-point-in-time-lookup.ipynb) |
| 20 | [Apply a batch of changes to an SCD2 table](https://rishikesh8pandey.github.io/data-engineering-practice/problems/apply-changes-to-scd2/) | PySpark | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/020-apply-changes-to-scd2.ipynb) |
| 21 | [Order statuses as columns, with zeros where there are none](https://rishikesh8pandey.github.io/data-engineering-practice/problems/pivot-order-statuses/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/021-pivot-order-statuses.ipynb) |
| 22 | [The invoice numbers that sort like words](https://rishikesh8pandey.github.io/data-engineering-practice/problems/text-invoice-numbers/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/022-text-invoice-numbers.ipynb) |
| 23 | [Conversion rates when the denominator is zero](https://rishikesh8pandey.github.io/data-engineering-practice/problems/conversion-rate-zero-denominator/) | SQL | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/023-conversion-rate-zero-denominator.ipynb) |
| 24 | [Monthly active users are not the sum of the days](https://rishikesh8pandey.github.io/data-engineering-practice/problems/monthly-active-users/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/024-monthly-active-users.ipynb) |
| 25 | [Revenue by category when a product sits in several](https://rishikesh8pandey.github.io/data-engineering-practice/problems/revenue-by-category-many-to-many/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/025-revenue-by-category-many-to-many.ipynb) |
| 26 | [Fill the gaps in sensor readings with the last known value](https://rishikesh8pandey.github.io/data-engineering-practice/problems/forward-fill-sensor-readings/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/026-forward-fill-sensor-readings.ipynb) |
| 27 | [Collapse double-clicks into one click](https://rishikesh8pandey.github.io/data-engineering-practice/problems/collapse-double-clicks/) | SQL | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/027-collapse-double-clicks.ipynb) |
| 28 | [The longest login streak](https://rishikesh8pandey.github.io/data-engineering-practice/problems/longest-login-streak/) | SQL | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/028-longest-login-streak.ipynb) |
| 29 | [A three-step funnel, in order, within seven days](https://rishikesh8pandey.github.io/data-engineering-practice/problems/ordered-funnel-seven-days/) | SQL | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/029-ordered-funnel-seven-days.ipynb) |
| 30 | [Everything except LOW, which quietly excludes the unknowns](https://rishikesh8pandey.github.io/data-engineering-practice/problems/exclude-value-drops-nulls/) | PySpark | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/030-exclude-value-drops-nulls.ipynb) |
| 31 | [Amounts that arrive as text](https://rishikesh8pandey.github.io/data-engineering-practice/problems/amounts-stored-as-text/) | PySpark | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/031-amounts-stored-as-text.ipynb) |
| 32 | [JSON payloads that changed shape](https://rishikesh8pandey.github.io/data-engineering-practice/problems/json-payload-schema-drift/) | PySpark | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/032-json-payload-schema-drift.ipynb) |
| 33 | [Customers to date, counted once](https://rishikesh8pandey.github.io/data-engineering-practice/problems/cumulative-unique-customers/) | PySpark | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/033-cumulative-unique-customers.ipynb) |
| 34 | [Reconcile a target table against its source](https://rishikesh8pandey.github.io/data-engineering-practice/problems/reconcile-source-and-target/) | PySpark | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/034-reconcile-source-and-target.ipynb) |
| 35 | [One golden record from three systems](https://rishikesh8pandey.github.io/data-engineering-practice/problems/golden-customer-record/) | PySpark | Hard | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/035-golden-customer-record.ipynb) |
| 36 | [The bucket no order ever lands in](https://rishikesh8pandey.github.io/data-engineering-practice/problems/when-chain-order/) | Debug the AI | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/036-when-chain-order.ipynb) |
| 37 | [The city average that no order adds up to](https://rishikesh8pandey.github.io/data-engineering-practice/problems/average-of-averages/) | Debug the AI | Easy | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/037-average-of-averages.ipynb) |
| 38 | [The month that ends a day early](https://rishikesh8pandey.github.io/data-engineering-practice/problems/between-on-timestamps/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/038-between-on-timestamps.ipynb) |
| 39 | [Seven rows are not seven days](https://rishikesh8pandey.github.io/data-engineering-practice/problems/rolling-seven-days/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/039-rolling-seven-days.ipynb) |
| 40 | [The load that never updates anything](https://rishikesh8pandey.github.io/data-engineering-practice/problems/load-never-updates/) | Debug the AI | Medium | [Open in Colab](https://colab.research.google.com/github/rishikesh8pandey/data-engineering-practice/blob/main/notebooks/040-load-never-updates.ipynb) |

## Found a mistake?

Open an issue: https://github.com/rishikesh8pandey/data-engineering-practice/issues

This repository is build output (the website and the notebooks). Changes made here by
hand are overwritten by the next build, so please report problems instead of sending
pull requests against the HTML.
