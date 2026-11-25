# atrams.cc 2027 redesign: progress

Live site stays on `main` (GitHub Pages). All redesign work happens on `redesign-2027`. Nothing deploys without Vedant's approval.

## Status
- 2026-11-25: audit done; three directions on the design canvas https://claude.ai/artifact/7WyZSXvvBdH5v6fvWPhgqE
  - A · Desire Lines (recommended): planned route vs the route people took; Chicago street grid; scarlet desire line.
  - B · Load-Bearing: Chicago steel-frame elevation, red-oxide primer, "Show the structure" accessibility X-ray. Uses Big Shoulders (conflicts with the Montserrat rule).
  - C · Exposure Sheet: animation X-sheet, storyboard scrubber, key frame = where people stopped.
- Vedant rejected A, B and C (too conceptual). Asked for fundamentals: visual design, motion and UX for the hiring audience.
- D · Fundamentals first: home + Invisible Obstacles case opening on the canvas (row 2). HD hero shots from the live case pages on a #EDEAE2 light table; text left / image right for every project; 60-second version at the top of each case.
- Waiting on: feedback on D.

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

## 2026-11-25 · Direction D progress (canvas row 2)
- Home: glass sticky nav, weight-contrast wordmark (Vedant 800 / Atram 500), metal career card (5+ years), video thumbnails recorded from live covers on #EDEAE2, Quick look (problem / found / my part / landed), Expertise selector, Writing, Contact with copy-email, footer.
- Labels: sentence case, no numbers (user asked).
- Dark mode via tokens + toggle; phone layout checked at 390px in the canvas.
- Case: Invisible Obstacles opening with 60-second version; same nav; video hero.
- Visuals board: NPS tree-test lines, Treevah 100-square audit, IO participant lanes, CeraVe tasks + SUS 54.1 vs 68, WH persona spectrum by rank.
- Logo options A–E on canvas; A applied, waiting on user's pick.

## 2026-11-25 · D live across the site
- Homepage D published (main).
- Inner pages: assets/d.css + assets/d.js layer — glass nav with Contact, two-weight wordmark, title-first hero, 60-second summary panel, video hero on case studies, dark next-case card, 5px buttons.
- Mobile menu fixed (nav will-change created a containing block for the fixed menu).
