# Tálamo Extended Markdown Syntax v1.1

## 📋 Table of Contents

1. [Overview](#overview)
2. [Meta Block](#meta-block)
3. [Interactive Components](#interactive-components)
4. [Trading Simulator v1](#trading-simulator-v1-legacy)
5. [Trading Simulator v2](#trading-simulator-v2-enhanced)
6. [Validation Rules](#validation-rules)
7. [Migration Guide](#migration-guide)
8. [Examples](#examples)

---

## Overview

Tálamo Extended Markdown allows authors to create interactive, pedagogically rich lessons by embedding special components within standard Markdown content.

### Key Features v1.1

- ✅ **Backward compatible** with v1 syntax
- 🧩 **New meta block** for lesson metadata
- 📊 **Enhanced trading simulator** with OHLC data, risk management, and scoring
- 🔒 **Automatic validation** with helpful error messages
- 🎨 **Rich visual feedback** for better learning experience

### Syntax Format

All interactive blocks follow this pattern:

```
:::block-type attribute="value" attribute2="value2"
[section_name]
content or JSON data

[another_section]
more content
:::
```

---

## Meta Block

**Purpose**: Define lesson-level metadata for better organization, filtering, and SEO.

### Syntax

```
:::meta
level: beginner | intermediate | advanced
duration: 12min
tags: trading, price-action, risk-management
id: lesson-trend-01
:::
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `level` | enum | No | Lesson difficulty: `beginner`, `intermediate`, `advanced` |
| `duration` | string | No | Estimated time in format: `"12min"`, `"45min"` |
| `tags` | array | No | Comma-separated list of relevant topics |
| `id` | string | No | Unique lesson identifier for internal tracking |

### Example

```
:::meta
level: intermediate
duration: 25min
tags: forex, support-resistance, entry-timing
id: forex-sr-entry-01
:::
```

---

## Interactive Components

### Accordion

**Purpose**: Collapse multiple sections for better readability.

```
:::accordion
## Section Title 1
Content for section 1. Supports **markdown** formatting.

## Section Title 2
Content for section 2 with [links](https://example.com).

## Section Title 3
More content here.
:::
```

---

### Tabs

**Purpose**: Present alternative views or comparisons side-by-side.

```
:::tabs
[label="Long Position"]
Content for long position setup.

[label="Short Position"]
Content for short position setup.

[label="Neutral"]
When to stay out of the market.
:::
```

---

### Flip Card

**Purpose**: Create flashcard-style Q&A or concept/definition pairs.

```
:::flipcard
[front]
What is a higher high (HH)?

[back]
A higher high occurs when price makes a peak that is higher than the previous peak, indicating bullish momentum.
:::
```

---

### Callout

**Purpose**: Highlight important information with visual emphasis.

**Types**: `info`, `warning`, `success`, `danger`, `tip`

```
:::callout type="warning"
⚠️ **Risk Warning**: Never risk more than 1-2% of your account on a single trade.
:::

:::callout type="tip"
💡 Always wait for confirmation before entering a trade.
:::
```

---

## Trading Simulator v1 (Legacy)

**Status**: ✅ Fully supported, maintained for backward compatibility

### Minimal Example

```
:::trading-sim asset="EURUSD" scenario="uptrend_pullback"
[educational_context]
{
  "concept": "Buying pullbacks in uptrends",
  "whatToLook": ["Higher highs", "Higher lows", "Pullback to support"],
  "hint": "Look for price rejecting from the rising support zone"
}

[scenario_data]
{
  "historical": [1.0850, 1.0870, 1.0860, 1.0880, 1.0875],
  "current": 1.0865,
  "future": [1.0870, 1.0885, 1.0900],
  "correct_action": "buy",
  "entry": 1.0865,
  "stop_loss": 1.0850,
  "take_profit": 1.0900
}

[question]
Analyze the chart. Should you buy, sell, or skip this opportunity?

[feedback_buy]
✅ **Excellent!** You correctly identified the pullback opportunity in the uptrend.

[feedback_sell]
❌ **Incorrect.** Selling against the trend is risky. The structure shows bullish continuation.

[feedback_skip]
⚠️ **Missed opportunity.** This was a valid pullback setup with clear structure.
:::
```

### v1 Required Fields

- `asset` (attribute)
- `scenario` (attribute)
- `[question]`
- `[scenario_data]` with all required fields
- At least one feedback section

---

## Trading Simulator v2 (Enhanced)

**Status**: 🚀 New in v1.1

### Key Enhancements

- 📊 **OHLC candlestick data** support
- 💰 **Market parameters** (spread, slippage, commission)
- 🎯 **Risk management** (balance, risk %, R:R ratio)
- 📈 **Chart customization** (candles/line, timeframes)
- 💡 **Progressive hints** system
- 🧾 **Rubric-based scoring**
- 🧩 **Multi-step scenarios**

### Full Example

```
:::trading-sim asset="EURUSD" scenario="uptrend_pullback" v="2"
chart="candles" timeframe="H1" reveal_future="after_decision"

[market]
{
  "spread": 0.0002,
  "slippage": 0.0001,
  "commission_per_lot": 7
}

[risk]
{
  "initial_balance": 10000,
  "risk_pct": 1,
  "min_rr": 1.5
}

[dataset]
{
  "ohlc": [
    ["2024-05-01T10:00Z", 1.0810, 1.0830, 1.0800, 1.0820],
    ["2024-05-01T11:00Z", 1.0820, 1.0850, 1.0815, 1.0845],
    ["2024-05-01T12:00Z", 1.0845, 1.0860, 1.0840, 1.0855],
    ["2024-05-01T13:00Z", 1.0855, 1.0870, 1.0850, 1.0865]
  ]
}

[annotations]
{
  "higherHighs": [1, 3],
  "higherLows": [0, 2],
  "supportZones": [1.0850]
}

[context]
{
  "concept": "Trading pullbacks in established uptrends",
  "whatToLook": [
    "Identify the trend direction using HH and HL",
    "Wait for pullback to support zone",
    "Confirm bounce with bullish candle"
  ],
  "hint": "The trend is your friend. Buy weakness in uptrends."
}

[question]
1. What is the current trend direction?
2. Is price at a logical support level?
3. What is your R:R ratio if you enter here?

[hints]
- Count the higher highs and higher lows
- Check if price is near the support zone at 1.0850
- Calculate distance to TP vs distance to SL

[rubric]
{
  "trend_alignment": 0.35,
  "rr_meets_min": 0.35,
  "structure_based_sl": 0.20,
  "entry_location_quality": 0.10
}

[feedback_general]
✅ **Key Takeaway**: Always validate three elements:
1. Trend structure (HH/HL or LH/LL)
2. Entry location (support/resistance)
3. Risk:Reward ratio (minimum 1.5:1)

[feedback_buy]
✅ **Excellent decision!**
- Trend: Bullish (HH & HL confirmed)
- Entry: Near support at 1.0850
- R:R: Above minimum 1.5:1
You followed the structure and managed risk properly.

[feedback_sell]
❌ **Incorrect decision.**
- You're trading AGAINST the uptrend
- No structural reason for reversal
- R:R is not in your favor
Review the trend identification process.

[feedback_skip]
⚠️ **Opportunity missed.**
This was a valid pullback entry with:
- Clear uptrend structure
- Price at support
- Good R:R ratio
Consider being more aggressive with high-probability setups.
:::
```

### v2 New Sections

#### `[market]` - Market Parameters

```json
{
  "spread": 0.0002,       // bid-ask spread (required)
  "slippage": 0.0001,     // expected slippage (optional)
  "commission_per_lot": 7, // broker commission (optional)
  "pip_size": 0.0001      // pip size for calculation (optional)
}
```

#### `[risk]` - Risk Management

```json
{
  "initial_balance": 10000, // account balance (required)
  "risk_pct": 1,            // risk per trade, max 5% (required)
  "min_rr": 1.5             // minimum R:R ratio (required)
}
```

#### `[dataset]` - OHLC Data

```json
{
  "ohlc": [
    ["ISO8601_timestamp", open, high, low, close, volume_optional],
    ["2024-05-01T10:00Z", 1.0810, 1.0830, 1.0800, 1.0820, 1250]
  ]
}
```

**Validations**:
- Timestamps must be chronological
- High >= max(Open, Close)
- Low <= min(Open, Close)

#### `[annotations]` - Chart Overlays

```json
{
  "higherHighs": [1, 3],           // indices of HH candles
  "higherLows": [0, 2],            // indices of HL candles
  "supportZones": [1.0850],        // price levels
  "resistanceZones": [1.0900],     // price levels
  "trendLines": [{
    "start": 0,
    "end": 3,
    "price1": 1.0800,
    "price2": 1.0850
  }]
}
```

#### `[hints]` - Progressive Hints

Simple array:
```json
[
  "Look for higher highs and higher lows",
  "Check if price is near a support zone",
  "Validate your R:R ratio meets minimum 1.5"
]
```

#### `[rubric]` - Scoring System

```json
{
  "trend_alignment": 0.35,
  "rr_meets_min": 0.35,
  "structure_based_sl": 0.20,
  "entry_location_quality": 0.10
}
```

**Validation**: Weights must sum to 1.0

#### `[steps]` - Multi-Step Scenarios

```json
[
  {
    "id": "1",
    "slice": { "end": 3 },
    "question": "Identify the trend direction",
    "correct_action": "identify_trend"
  },
  {
    "id": "2",
    "slice": { "end": 4 },
    "question": "Plan your entry, SL, and TP",
    "correct_action": "plan_buy"
  }
]
```

---

## Validation Rules

### Automatic Checks

✅ **JSON Validation**
- Valid JSON syntax (no trailing commas)
- Double quotes for strings
- Proper brackets and braces

✅ **Required Fields**
- All required fields present
- Correct data types
- Values within allowed ranges

✅ **Asset Whitelist**
```
EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD
XAUUSD, XAGUSD, BTCUSD, ETHUSD
US30, US100, US500, DE40, UK100
```

✅ **Risk Limits**
- `risk_pct` ≤ 5%
- `min_rr` ≥ 1.0
- Rubric weights sum to 1.0

✅ **Temporal Consistency**
- OHLC timestamps in chronological order
- Future data comes after current

✅ **Price Logic**
- Buy: SL < Entry < TP
- Sell: TP < Entry < SL

### Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Unexpected token` | Check for missing commas or quotes |
| `Invalid asset` | Use only whitelisted assets |
| `Risk percentage too high` | Keep risk_pct ≤ 5% |
| `Rubric must sum to 1.0` | Adjust weights to total exactly 1.0 |
| `Timestamps not chronological` | Sort OHLC data by time |
| `Invalid OHLC` | Ensure High ≥ max(O,C) and Low ≤ min(O,C) |

---

## Migration Guide

### v1 → v1.1 (No Breaking Changes)

**All v1 content continues to work without modification.**

### Recommended Enhancements

1. **Add meta block** to existing lessons:
```
:::meta
level: beginner
duration: 15min
tags: forex, trend-trading
:::
```

2. **Use aliases** for consistency:
- `[educational_context]` → `[context]`
- `[scenario_data]` → `[data]` (v2 only)

3. **Upgrade to v2** when you need:
- Real OHLC data
- Risk management features
- Scoring and rubrics
- Progressive hints

### v2 Opt-in

Simply add `v="2"` attribute:
```
:::trading-sim asset="EURUSD" scenario="test" v="2"
```

---

## Examples

### Example 1: Beginner Lesson with Accordion

```markdown
# Understanding Support and Resistance

:::meta
level: beginner
duration: 10min
tags: price-action, support, resistance
:::

Support and resistance are foundational concepts in technical analysis.

:::accordion
## What is Support?
Support is a price level where demand is strong enough to prevent further decline.

## What is Resistance?
Resistance is a price level where selling pressure prevents further upside.

## How to Identify Them?
1. Look for price bouncing multiple times from the same level
2. Previous highs often become resistance
3. Previous lows often become support
:::
```

### Example 2: Intermediate Lesson with v2 Simulator

```markdown
# Trading Pullbacks in Uptrends

:::meta
level: intermediate
duration: 20min
tags: trend-following, pullback, entry-timing
:::

## Key Concepts

:::callout type="info"
A pullback is a temporary reversal within a larger trend. It offers lower-risk entry opportunities.
:::

## Practice Scenario

:::trading-sim asset="GBPUSD" scenario="pullback_to_ema" v="2"
chart="candles" timeframe="H4"

[context]
{
  "concept": "Buying pullbacks to moving averages in uptrends",
  "whatToLook": ["Uptrend structure", "Pullback to EMA", "Bullish rejection candle"],
  "hint": "The 21 EMA often acts as dynamic support in trends"
}

[risk]
{
  "initial_balance": 10000,
  "risk_pct": 1.5,
  "min_rr": 2
}

[question]
Price has pulled back to the 21 EMA after a strong rally. Do you enter long, short, or skip?

[feedback_buy]
✅ Perfect! You identified the pullback opportunity with confluence at the EMA.

[feedback_sell]
❌ Trading against the trend is high-risk. The structure is bullish.

[feedback_skip]
⚠️ This was a textbook pullback setup. Consider being more aggressive with strong setups.
:::
```

---

## Best Practices

### ✅ DO

- Use meta blocks for all lessons
- Provide educational context in simulators
- Write detailed, actionable feedback
- Test JSON validity before publishing
- Use appropriate difficulty levels
- Include hints for complex scenarios

### ❌ DON'T

- Don't use trailing commas in JSON
- Don't exceed 5% risk in scenarios
- Don't skip feedback sections
- Don't use non-whitelisted assets
- Don't make rubric weights sum to >1.0
- Don't forget to validate before saving

---

## Validator Usage

```bash
# Validate a single lesson file
npm run validate-lesson src/lessons/my-lesson.md

# Validate all lessons
npm run validate-lessons

# Output
✅ lesson-01.md - Valid
❌ lesson-02.md - 3 errors:
  Line 45: Invalid JSON in [scenario_data]
  Line 67: risk_pct exceeds 5%
  Line 89: Missing required field 'question'
```

---

## Support

For questions or issues:
- 📚 Review this documentation
- 🔍 Check the [Examples](#examples) section
- 💬 Ask in the Tálamo team channel
- 🐛 Report bugs in the issue tracker

---

**Version**: 1.1.0  
**Last Updated**: 2025  
**Status**: ✅ Stable
