# PostHog dashboards — click-by-click

Five dashboards that turn the events the app already sends into the views you'd
get from Paperform (and more). Build each insight, then pin it to one dashboard.

> Heads-up: insights fill with data once traffic flows (after deploy, or by
> clicking through `/install-quote` yourself a few times). Empty at first = normal.

## The events you'll use

| Event | Meaning | Useful properties |
|---|---|---|
| `page_view` | any page load | `page_path`, `traffic_source`, `campaign`, `device_type` |
| `coverage_checked` | postcode checked | `coverage_result`, `location_name` |
| `quote_started` | entered the form flow | |
| `form_step_viewed` | reached a form step | `step_name` (postcode/name/phone/email/install_type/service), `form_name` |
| `quote_submitted` | form submitted | |
| `lead_created` | lead saved | `install_type`, `lead_id` |
| `cta_clicked` | any CTA | `cta_location` |
| `whatsapp_clicked` / `phone_clicked` | contact intent | |
| `scroll_depth` | 25/50/75/90/100% | `percent` |
| `experiment_viewed` / `experiment_converted` | A/B exposure + goal | `flag_key` |

Every event also carries `device_type`, `traffic_source`, `campaign`, `variant_id`.

## First: create the dashboard

PostHog left menu → **Dashboards → New dashboard** → name it **"InstallPros — Growth"** → Create.
Build each insight below (Product analytics → New insight), then **Add to dashboard → InstallPros — Growth**.

---

## 1. Funnel Analysis (step-by-step drop-off — the Paperform view)

New insight → **Funnel**. Add these steps in order:
1. `page_view`
2. `form_step_viewed` → add property filter **`step_name = postcode`**
3. `form_step_viewed` → **`step_name = name`**
4. `form_step_viewed` → **`step_name = phone`**
5. `form_step_viewed` → **`step_name = email`**
6. `form_step_viewed` → **`step_name = install_type`**
7. `lead_created`

- Set the conversion window to ~30 minutes.
- **Breakdown by `device_type`** to see mobile vs desktop drop-off (your audit's key gap).
- Save as **"Lead funnel — step by step"** → add to dashboard.

## 2. Landing Page Performance

Insight A — **Trends**, event `page_view`, "Unique users", **breakdown by `traffic_source`**. Save "Traffic by source".
Insight B — **Trends**, event `page_view`, **breakdown by `page_path`**. Save "Views by page".
Insight C — **Trends**, event `$pageleave` → property **`$prev_pageview_max_scroll_percentage`** (or use `scroll_depth` by `percent`) to see how far people scroll. Save "Scroll depth".
Add all three to the dashboard.

## 3. User Paths

New insight → **Paths**.
- Start point: **`page_view`**.
- (Optional) End point: `lead_created`.
- This shows the routes people take and where they exit. Save "User paths" → add to dashboard.

## 4. Retention

New insight → **Retention**.
- Cohortizing event: **`page_view`** (first time).
- Returning event: **`page_view`** (or `lead_created` for "came back and converted").
- Period: Weekly. Save "Visitor retention" → add to dashboard.

## 5. Conversion Analysis

Insight A — **Trends**: `lead_created` count over time, **breakdown by `traffic_source`**. Save "Leads by source".
Insight B — **Trends** with a **formula**: add series A = `lead_created`, B = `page_view`, formula **`A / B`**, display as %. That's your **conversion rate**. Breakdown by `device_type`. Save "Conversion rate".
Insight C (A/B) — **Trends**: `experiment_converted` broken down by **`variant_id`** (or a Funnel `experiment_viewed → lead_created` broken down by `variant_id`). Save "Experiment conversion".
Add all to the dashboard.

---

## Tips

- **Session replays**: Session replay → filter *performed `quote_started` but not `lead_created`* → watch exactly where people abandon. This is the qualitative gold Paperform can't give you.
- **Save filters as "insights on the dashboard"** so the whole team sees the same numbers.
- Once live, set `lead_created`, `quote_submitted` and `whatsapp_clicked` as **conversions** in PostHog (Data management → Events → mark as conversion) for cleaner goal reporting.
