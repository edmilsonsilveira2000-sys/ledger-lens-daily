CREATE TABLE public.news (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('Markets','Crypto','Global Economy','Regulations & Law')),
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  impact_score smallint CHECK (impact_score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.news TO anon, authenticated;
GRANT ALL ON public.news TO service_role;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news" ON public.news
  FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.news (id, title, category, excerpt, content, image_url, impact_score, created_at) VALUES
('fed-signals-pause-equities-rally',
 'Fed Signals Extended Pause as Equities Rally to Record Highs',
 'Markets',
 'Wall Street closed at all-time highs after policymakers indicated rates will hold steady through the first quarter, easing fears of a renewed tightening cycle.',
 $md1$The S&P 500 climbed **1.4%** to a record close on Wednesday after Federal Reserve officials signaled that benchmark rates would remain unchanged well into the new year, a message investors read as confirmation that the central bank's fight against inflation has entered its final chapter.

The Nasdaq Composite advanced 1.9%, led by semiconductor and cloud-infrastructure names, while the Dow Jones Industrial Average added more than 450 points. Treasury yields fell across the curve, with the 10-year note slipping to **3.92%**, its lowest level since early summer.

> "The committee sees no urgency to move in either direction. Policy is well positioned to respond to incoming data." — Federal Reserve Chair, in prepared remarks

## A shift in market psychology

Strategists noted that the rally was notably broad. Small-cap stocks, which are more sensitive to borrowing costs, outperformed large caps for a third consecutive session, and nine of the eleven S&P sectors finished higher.

"What we're seeing is a market that has stopped fighting the Fed," said one senior portfolio manager at a New York-based asset manager. "The question is no longer *whether* the cycle has peaked, but how long the plateau lasts."

## What to watch

- Core PCE inflation data due next Thursday
- Third-quarter earnings from the largest technology firms
- Labor market figures, which remain the Fed's principal swing factor

Analysts caution that elevated valuations leave little room for disappointment, but for now momentum firmly favors the bulls.$md1$,
 '/news/markets.jpg', 94, '2026-10-21T16:45:00Z'),

('bitcoin-etf-inflows-institutional',
 'Bitcoin Tops $118,000 as Institutional ETF Inflows Hit Monthly Record',
 'Crypto',
 'Spot bitcoin funds absorbed more than $9 billion in October, the largest monthly haul since launch, as pension funds and endowments expand digital-asset allocations.',
 $md2$Bitcoin surged past **$118,000** on Wednesday, extending a three-week rally fueled by unprecedented demand from institutional investors through U.S.-listed spot exchange-traded funds.

Data compiled by industry trackers show net inflows of more than **$9 billion** into spot bitcoin ETFs month-to-date, eclipsing the previous record set during the products' debut period.

> "This is no longer a retail story. The marginal buyer today is a fiduciary with a multi-decade horizon." — Head of digital assets at a global custodian bank

## Pensions enter the arena

Several U.S. state pension funds disclosed new or expanded positions in recent regulatory filings, while at least two Ivy League endowments confirmed allocations of between 1% and 2% of assets.

Ether also gained, rising 4.6% amid renewed speculation over staking-enabled fund structures. Trading volumes on major regulated exchanges reached their highest level of the year.

## Risks remain

Market veterans warn that leverage in derivatives markets has climbed sharply, with open interest in bitcoin futures at record levels. **A sharp reversal could trigger cascading liquidations**, they note, particularly over thinly traded weekend sessions.$md2$,
 '/news/crypto.jpg', 81, '2026-10-21T13:20:00Z'),

('global-trade-imf-outlook',
 'IMF Upgrades Global Growth Outlook as Trade Volumes Rebound',
 'Global Economy',
 'The Fund now expects world output to expand 3.3% next year, citing resilient consumer spending in the U.S. and a stronger-than-expected recovery in Asian export hubs.',
 $md3$The International Monetary Fund raised its forecast for global economic growth on Tuesday, pointing to a rebound in cross-border trade and easing supply-chain pressures as key drivers of improved momentum.

In its latest World Economic Outlook, the Fund projected global GDP growth of **3.3%** for next year, up from 3.1% in its July estimate. Advanced economies are expected to grow 1.8%, while emerging markets are forecast to expand 4.2%.

## Asia leads the recovery

Container throughput at major ports in Singapore, Busan, and Shenzhen has risen for six consecutive months. Economists attribute the turnaround to restocking cycles and robust demand for electronics and green-energy components.

> "The global economy has proven more resilient than many feared. But resilience is not the same as strength." — IMF Chief Economist

## Downside risks

The report flagged three principal threats:

1. Escalating tariff disputes between major trading blocs
2. Elevated public debt levels in several G20 economies
3. Persistent services inflation in Europe

Finance ministers gathering in Washington this week are expected to focus heavily on debt sustainability frameworks for lower-income nations.$md3$,
 '/news/economy.jpg', 72, '2026-10-20T09:00:00Z'),

('sec-ai-disclosure-rules',
 'SEC Finalizes Landmark AI Disclosure Rules for Public Companies',
 'Regulations & Law',
 'Listed firms will be required to disclose material risks tied to artificial intelligence in annual filings, in a sweeping rule that takes effect for fiscal years beginning in 2027.',
 $md4$The Securities and Exchange Commission on Monday adopted new rules requiring publicly traded companies to disclose how artificial intelligence affects their operations, risk profile, and governance, marking the most significant expansion of corporate disclosure obligations in years.

Under the final rule, issuers must describe **material AI-related risks**, the board's role in overseeing those risks, and any significant incidents involving automated systems that could reasonably affect investors.

> "Investors deserve to understand how a technology this consequential is reshaping the companies they own." — SEC Commissioner, in a statement

## Industry reaction

Business groups expressed concern over compliance costs and the potential for litigation, while investor advocates praised the measure as overdue. Legal experts expect challenges in federal court, though most believe the rule's narrow focus on **materiality** improves its chances of surviving review.

## Key provisions

- Annual reporting on AI governance structures
- Disclosure of material AI incidents within four business days
- A phased compliance schedule, with smaller reporting companies given an additional year

The rule passed by a 3–2 vote along party lines.$md4$,
 '/news/law.jpg', 66, '2026-10-19T18:30:00Z');