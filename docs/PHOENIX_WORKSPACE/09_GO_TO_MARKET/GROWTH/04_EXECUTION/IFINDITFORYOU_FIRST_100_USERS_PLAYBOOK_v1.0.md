# IFINDITFORYOU FIRST 100 USERS PLAYBOOK v1.0

## Operating rule

**HELP FIRST — PRODUCT SECOND.** No unsolicited bulk posting, fake testimonials, vote solicitation or rule evasion.

## Phase A — 0→25 users (days 1–14)

### Daily founder workflow

1. Find 3–5 fresh public requests from people seeking Vespa/scooter/moto models, parts or offers.
2. Check community rules before replying; if self-promotion is prohibited, provide useful source guidance without a product link.
3. Offer one manual/assisted search: “If useful, I can compare the main Swiss sources and send a transparent result list.”
4. Record consent, query, sources, time, useful result, click/save/share, and feedback.
5. Ask one non-leading question: “What would you have done if this service did not exist?”
6. After value delivery, request permission to anonymize the search as a case study.

### Target sources

| Place | Real audience | Entry mode | Rule/risk |
|---|---|---|---|
| [r/AskSwitzerland](https://www.reddit.com/r/askswitzerland/) | residents asking where/how to buy | answer only when request is directly relevant | high spam risk; never create disguised promotional questions |
| [r/Zurich](https://www.reddit.com/r/zurich/) | local buyers, including used scooter queries | answer local source question helpfully | ask mods before product-led post |
| [r/Vespa](https://www.reddit.com/r/Vespa/) | global Vespa owners/seekers | contribute knowledge, ask for research volunteers | international coverage may exceed current providers |
| [Vespa Club Europe – Switzerland](https://www.vespaclubeuropa.com/country.php?country=SZE) | Swiss clubs/events | direct partnership email to club organizer | do not scrape member lists |
| [SMVC](https://www.smvc.ch/) | historic vehicle owners/restorers | propose a free rare-part search clinic/report | club relationship before promotion |
| [VCCSR](https://www.vccsr.ch/presentation) | Swiss Romand vintage vehicle collectors | French-language partnership request | relevance must be vintage/parts, not generic launch |
| [MotoScout24](https://www.motoscout24.ch/) | active marketplace demand | source in searches, not a community to spam | respect terms and access boundaries |
| Ricardo/Tutti/Anibis | active Swiss second-hand demand | source/user research; link to canonical listings | no automated access without authorization |

### First-contact message

> Ciao — non ti scrivo per venderti qualcosa. Sto testando un servizio svizzero per evitare di ripetere la stessa ricerca su più marketplace. Se mi dai modello, anno, budget e area, faccio gratuitamente una ricerca trasparente e ti mando fonti e limiti. In cambio chiedo solo 10 minuti di feedback. Nessuna garanzia di trovare l’oggetto e nessuna pubblicazione senza consenso.

### Goal

- 25 utenti reali;
- 20 ricerche completate;
- 10 WQSS;
- 10 interviste;
- 3 case study pubblicabili;
- 3 referral spontanei o intro.

## Phase B — 25→100 users (days 15–45)

### Repeat only channels with signal

Un canale continua se genera almeno 3 utenti reali e almeno 1 WQSS ogni 5 ore founder. In caso contrario viene sospeso o cambiato.

### Tactics

1. Pubblicare 2 case study/settimana: query, fonti, data, risultati, cosa non è stato trovato, CTA.
2. Tenere una “Friday Find Clinic”: 5 richieste, risultati pubblicati solo con consenso.
3. Ottenere 3 partner: club Vespa/moto, officina/restauratore, creator/newsletter verticale.
4. Testare l’intento di condivisione con un artifact/prototipo manuale; una share page di prodotto richiede separata Product review e non è autorizzata da questo Playbook.
5. Testare manualmente monitoring intent/follow-up solo con utenti che non hanno trovato subito; ciò non autorizza una feature di monitoring.
6. Pubblicare una pagina “Dove cercare una Vespa usata in Svizzera: fonti e differenze”, senza copiare contenuti interni Atlas.

### Partnership pitch

> Vorremmo offrire ai vostri membri una sessione gratuita “trova il modello/ricambio difficile”. Voi scegliete 5 richieste; noi cerchiamo attraverso le fonti disponibili, mostriamo metodo e limiti e vi restituiamo un report senza pubblicità invasiva. Nessun costo, nessun accesso ai dati membri, nessuna esclusiva. Se non produce valore, ci fermiamo.

### Goal

- 100 utenti reali cumulativi;
- 40 WQSS cumulativi;
- ≥20 utenti di ritorno/monitoraggio;
- ≥10 referral;
- un canale con CAC cash = 0 e costo founder misurato;
- un formato contenuto che genera almeno 5 signup qualificati in 30 giorni.

## Community etiquette checklist

- Leggere regole e post recenti.
- Chiedere permesso al moderatore per contenuti propri.
- Rispondere alla domanda anche se il link viene rimosso.
- Dichiarare sempre l’affiliazione del founder.
- Non chiedere upvote. Product Hunt lo vieta espressamente ([guida ufficiale](https://www.producthunt.com/launch)).
- Non trasformare forum in lead list.
- Non inviare DM senza contesto o consenso.
- Non pubblicare risultati personali senza consenso.

## Interview script (10 minuti)

1. Raccontami l’ultima volta che hai cercato qualcosa di difficile.
2. Quali siti hai usato e quante volte sei tornato?
3. Qual era il costo di non trovarlo?
4. Che cosa ti ha dato fiducia nel risultato?
5. Quale risultato sarebbe “utile” anche senza acquisto?
6. Vorresti salvare/monitorare la ricerca?
7. Condivideresti una ricerca o un affare? Con chi?
8. Pagheresti per monitoraggio/copertura maggiore? Solo dopo aver mostrato valore.

## Tracking governance

Il tracking iniziale è founder-led/manuale e raccoglie solo il minimo necessario per l’esperimento. `UNKNOWN` è un valore valido e non deve essere trasformato in `NO`.

I nomi dei campi qui sotto sono etichette di ricerca Growth: **non sono Phoenix telemetry event names, database requirements o autorizzazioni di implementazione**. User-confirmed e system-observed sono evidenze distinte.

## Tracking sheet schema

```text
user_id | source_channel | segment | query | sources_checked | search_completed
useful_result | click | save | share | return_14d | monitoring_intent
referral | founder_minutes | coverage_gap | trust_issue | consent_case_study
```

## Stop conditions

- community complaint o moderator warning: stop immediato su quel canale;
- copertura insufficiente in 5 ricerche consecutive dello stesso tipo;
- nessun WQSS dopo 10 ricerche coerenti;
- richiesta di accesso/scraping non autorizzato;
- feedback che identifica rischio fraud/autenticità non gestibile.
