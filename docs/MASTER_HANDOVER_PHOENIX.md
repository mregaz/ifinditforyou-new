# PHOENIX / iFindItForYou — MASTER RECORD & HANDOVER

**Versione:** 2026-10-16  
**Stato:** Checkpoint 8 confermato  
**Ultimo commit:** 83fa2ca  
**Branch:** backup/ebay-working-20261015

## 1. SCOPO DEL DOCUMENTO

Questo documento preserva la continuità tecnica e operativa di Phoenix / iFindItForYou tra sessioni e chat.

È un registro di stato, decisioni, modifiche, verifiche, rischi e punto di ripresa. Non sostituisce il codice sorgente, la cronologia Git o la verifica diretta dello stato corrente.

Aggiornarlo al termine di ogni sessione significativa, senza cancellare informazioni ancora rilevanti.

## 2. VISIONE E STRATEGIA

Phoenix / iFindItForYou è un progetto di assistente di ricerca intelligente orientato a comprendere l'intento dell'utente, eliminare risultati irrilevanti e presentare opportunità pertinenti.

Strategia approvata: C prima, B dopo.

- Fase C: realizzare un MVP funzionante, verificabile con utenti reali.
- Fase B: evolvere successivamente verso una piattaforma più ampia di acquisizione delle informazioni, conoscenza e supporto alle decisioni.
- Priorità attuale: affidabilità del motore di ricerca, pertinenza dei risultati e protezione del lavoro già svolto.
- Preservare reversibilità, checkpoint Git e separazione delle modifiche.

## 3. AMBIENTE DI LAVORO

Repository locale sul Mac dell'utente:
~/Documents/ifinditforyou-phoenix

Branch verificato:
backup/ebay-working-20261015

Stack e componenti pertinenti:
- Next.js e TypeScript.
- Vitest per i test automatizzati.
- Provider eBay tramite Browse API.
- Marketplace eBay configurato: EBAY_CH.
- Motore Finder con provider e manager.

L'assistente non accede direttamente al Terminale locale: i comandi sono eseguiti dall'utente.

## 4. CHECKPOINT GIT CONFERMATI

Checkpoint 6:
b98c425 — Add intelligent Vespa fallback for empty and accessory-only results

Checkpoint 7:
a42e66c — Share eBay search deadline across initial and fallback requests

Checkpoint 8:
83fa2ca — Add eBay in-flight cancellation and automatic timeout tests

Ultimo checkpoint confermato: 83fa2ca.

I commit precedenti sono conservati nella cronologia Git. Non inventare hash o dettagli dei checkpoint più vecchi: recuperarli con git log quando necessario.

## 5. FUNZIONALITÀ EBAY IMPLEMENTATE

### 5.1 Interpretazione della ricerca

- Utilizzo di searchSubject quando disponibile.
- Classificazione dell'intento tra ricerca di veicolo e ricerca di accessori.
- Validazione degli annunci.
- Esclusione degli accessori nelle ricerche di veicoli completi.
- Mantenimento degli accessori quando richiesti esplicitamente.
- Classificazione di corrispondenza exact, alternative e unverified.

### 5.2 Fallback intelligente Vespa

Per ricerche di veicoli Vespa:
- Ricerca iniziale specifica.
- Categoria eBay 9939.
- Valutazione della presenza di veicoli utilizzabili.
- Se la ricerca non produce veicoli pertinenti, possibile fallback più ampio su Vespa.
- Il fallback non deve confondere ricambi e accessori con veicoli completi.

### 5.3 Protezione temporale

- Budget condiviso di 2500 ms tra ricerca iniziale e fallback.
- Segnale AbortSignal condiviso tra le due chiamate del provider.
- Timeout interno fetchEbay di 2500 ms.
- Timeout della richiesta HTTP Browse di 2000 ms.
- Protezione contro segnali esterni già annullati.
- Propagazione del segnale di annullamento alla richiesta HTTP.

Nota: questi limiti non costituiscono ancora una garanzia dimostrata sul tempo totale end-to-end del Finder, in presenza di retry del manager.

## 6. FILE PRINCIPALI

Codice di produzione:
- lib/finder/providers/ebay/fetch.ts
- lib/finder/providers/ebay/index.ts

Test:
- lib/finder/providers/ebay/tests/fetch.test.ts
- lib/finder/providers/ebay/tests/provider.test.ts

Altri componenti pertinenti:
- lib/finder/providers/ebay/intent.ts
- lib/finder/providers/ebay/relevance.ts
- lib/finder/providers/ebay/validator.ts
- lib/finder/providers/ebay/mapper.ts
- lib/finder/subjectMatch.ts
- Manager Finder e relativi test: individuare i percorsi effettivi prima di modificarli.

## 7. VERIFICHE CONFERMATE

Data: 16 ottobre 2026.

Suite eBay completa:
11 file di test superati su 11.
107 test superati su 107.
0 test falliti.

Comando utilizzato:
npx vitest run lib/finder/providers/ebay/tests

TypeScript:
Controllo superato senza errori.

Comando utilizzato:
npx tsc --noEmit --incremental false

Test specifici:
- Ricerca eBay e validazione risposte.
- Gestione errori HTTP.
- Fallback Vespa.
- Fallback dopo risultati costituiti soltanto da accessori.
- Condivisione dello stesso AbortSignal tra ricerca iniziale e fallback.
- Nessuna richiesta Browse con segnale già annullato.
- Annullamento manuale di richiesta HTTP già avviata.
- Annullamento automatico di richiesta HTTP bloccata dopo circa 2000 ms.

Limite dei test:
Le simulazioni HTTP dimostrano la propagazione e la gestione dei segnali nel contesto testato. Non sostituiscono una verifica di integrazione end-to-end con il manager e con le condizioni reali della rete.

## 8. FILE PREESISTENTI DA PRESERVARE

Ultimo git status --short verificato:

 M next-env.d.ts
?? lib/finder/providers/ebay/index.ts.pre-relevance-backup
?? tsconfig.tsbuildinfo

Questi tre file erano già presenti e sono rimasti esclusi dai commit 7 e 8.

NON:
- eliminarli;
- ripristinarli automaticamente;
- includerli in commit senza autorizzazione;
- sovrascriverli per semplificare lo stato Git.

## 9. QUESTIONI TECNICHE APERTE

A. Verificare il budget condiviso di 2500 ms quando la ricerca iniziale consuma quasi tutto il tempo disponibile.

B. Verificare il comportamento del fallback quando il segnale scade durante OAuth o Browse.

C. Analizzare timeout e retry del manager. Dalla precedente revisione: timeout manager di circa 3000 ms per operazione, retry configurato con un tentativo aggiuntivo e ritardo di circa 250 ms. Confermare sul codice corrente prima di intervenire.

D. Verificare se il manager annulla realmente le richieste sottostanti o limita soltanto l'attesa tramite Promise.race.

E. Preservare la condivisione delle richieste OAuth in corso e non introdurre cancellazioni che danneggino chiamanti concorrenti.

F. Verificare scenari end-to-end eBay e, successivamente, gli altri provider senza regressioni.

G. Non considerare risolti problemi del manager o di altri provider soltanto perché i 107 test eBay sono verdi.

## 10. PROSSIMA MISSIONE

Titolo:
PHOENIX — Shared Deadline & Manager Retry Safety

Punto di partenza:
Commit 83fa2ca sul branch backup/ebay-working-20261015.

Sequenza raccomandata:
1. Verificare branch, HEAD e git status.
2. Leggere i test esistenti del manager.
3. Analizzare timeout, retry e cancellazione delle operazioni.
4. Progettare test mirati prima di modificare il codice.
5. Implementare soltanto le correzioni necessarie e reversibili.
6. Rieseguire test pertinenti e controllo TypeScript.
7. Registrare un nuovo checkpoint Git selettivo.
8. Aggiornare questo Master Record.

## 11. METODO DI COLLABORAZIONE

- Un solo comando Terminale alla volta.
- Attendere sempre il risultato incollato dall'utente.
- Modifiche TextEdit piccole e controllate.
- Attendere la conferma SALVATO prima del passo successivo.
- Non dichiarare un test superato senza il risultato.
- Non effettuare git add indiscriminati.
- Prima del commit controllare sempre git status e git diff --cached.
- Proteggere codice, test, backup e lavoro precedente.
- Distinguere fatti verificati, ipotesi e questioni aperte.
- Preferire una soluzione minima e sicura rispetto a una riscrittura estesa.

## 12. ISTRUZIONI PER LA CHAT SUCCESSIVA

Riprendere Phoenix dal checkpoint 83fa2ca.

Leggere questo documento, verificare lo stato Git corrente e non ripetere le attività già completate.

La prossima attività è la verifica del budget temporale condiviso e della sicurezza di timeout/retry del manager.

Non modificare i tre file preesistenti elencati nella sezione 8.

Procedere con un solo comando o una sola modifica alla volta.

## 13. STATO FINALE DELLA SESSIONE

Data: 2026-10-16.
Checkpoint codice più recente: 83fa2ca.
Test eBay: 107/107 superati.
TypeScript: OK.
Modifiche della missione di timeout: registrate in Git.
Questioni aperte: sezione 9.
Prossimo punto di ripresa: sezione 10.

Questo documento è un registro operativo da mantenere aggiornato.

FINE MASTER RECORD — PHOENIX
