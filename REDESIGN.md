# atrams.cc 2027 redesign: progress

Live site stays on `main` (GitHub Pages). All redesign work happens on `redesign-2027`. Nothing deploys without Vedant's approval.

## Status
- 2026-11-25: audit done; three directions on the design canvas https://claude.ai/artifact/7WyZSXvvBdH5v6fvWPhgqE
  - A · Desire Lines (recommended): planned route vs the route people took; Chicago street grid; scarlet desire line.
  - B · Load-Bearing: Chicago steel-frame elevation, red-oxide primer, "Show the structure" accessibility X-ray. Uses Big Shoulders (conflicts with the Montserrat rule).
  - C · Exposure Sheet: animation X-sheet, storyboard scrubber, key frame = where people stopped.
- Waiting on: Vedant's choice of direction.

## Standing rules
- Palette Snow #FFFBFC / Black #010400 / Scarlet #DE1A1A; blue #05299E and violet #5E4AE3 only for meaning.
- Montserrat headings, Public Sans body; 16px grid; 5px corners; light + dark; reduced motion; WCAG 2.2 AA.
- No frameworks or libraries unless Vedant approves.
- Never invent metrics, findings, quotes, screens or ownership. Intuit work is under NDA. Treevah: role is "UI/UX Designer", never intern or volunteer.
- Clearance needed: naming NPS.gov teammates; no Clarity recordings (participant names visible).

## Verified split points (planned vs taken)
- Invisible Obstacles: 7-page DOL job application · the date field stopped all four screen-reader users.
- NPS.gov: card sorts 80–100% agreement · tree test round 1, 22.2% found field trip information.
- Treevah: the handoff file · 51% of 585 web components didn't match it.
- CeraVe: compare, then buy at a retailer · 0 of 5 finished the comparison alone; SUS 54.1.
- Wearable Health: features used daily · some keep it to steps and sleep, or put it in a drawer.

## Audit numbers (25 Nov 2026)
- Homepage 1.1 MB, 18 images all lazy (first cover included).
- Case studies 13–19k px tall, 1.6–2.6k words; only Invisible Obstacles has a short version.
- 9 stylesheets layered with !important overrides.
