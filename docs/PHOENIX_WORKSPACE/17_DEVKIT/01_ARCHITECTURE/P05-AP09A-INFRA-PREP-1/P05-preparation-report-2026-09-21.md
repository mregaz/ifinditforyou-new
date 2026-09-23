> Copia derivata sanitizzata da SRC-01; originale invariato e hash in provenance.csv. Modifiche: home host sostituita, prossima azione storica contestualizzata; P05-EPR1-R1 separa estremi diagnostici, stato successivo e calcolo. La riserva di 2 ore è contabilità prudenziale, non misura AWS né nuova autorizzazione.

# P05 — Rapporto aggiornato di preparazione tecnica

Data dei riscontri: 21 settembre 2026. Missione: `P05-AP09A-INFRA-PREP-1`. Autorizzazione: `PREP-AUTH-AP09A-002`.

**Esito: infrastruttura preparata e controllo minimo ClockBound riuscito; evidenze non ancora archiviate in S3. Nessuna attestazione di conformità PCTR o effetto di governance.**

## Fonte e limiti

Il rapporto consolida schermate della console e output di comandi forniti dall’utente. Non costituisce un inventario AWS ottenuto direttamente tramite API, né un audit indipendente. Le azioni AWS sono state eseguite dall’utente. Account ID, ARN dell’account, indirizzi IP, email e credenziali sono omessi.

## Perimetro autorizzato

Una preparazione tecnica in Europe (Zurich), `eu-central-2`, con limite di 10 USD e 72 ore cumulative EC2. Una istanza, storage e rete dedicati, IAM circoscritto, installazione delle dipendenze e controlli minimi. Il budget mensile di 25 USD è una base per gli avvisi, non un ampliamento del limite di missione né un blocco automatico della spesa.

## Configurazione e stato

| Componente | Riscontro |
|---|---|
| Accesso umano | Utente non-root con MFA; ruolo di provisioning assunto con successo |
| Accesso host | Session Manager riuscito; nessuna coppia di chiavi SSH |
| Regione | Zurich; email AWS comunica completamento della validazione aggiuntiva EC2 |
| Rete | VPC dedicato, subnet `eu-central-2a`, Internet Gateway, route pubblica e associazione esplicita |
| Security group | Nessuna regola in ingresso; uscita TCP 443 |
| EC2 | Una t3.micro, On-Demand, crediti Standard, IMDSv2 obbligatorio, monitoraggio dettagliato disabilitato |
| AMI | `ami-00e0d27c7f2616229`, Amazon Linux 2023.12.20260914, kernel della famiglia 6.12, x86_64 |
| EBS | Un volume radice 16 GiB gp3 cifrato con `alias/aws/ebs`; 3000 IOPS, 125 MiB/s; eliminazione alla terminazione abilitata |
| Stato finale EC2 | Arrestata, verificato da screenshot; sessione console chiusa dall’utente |
| S3 | Bucket dedicato, vuoto all’ultima verifica; blocco pubblico attivo, SSE-S3, versioning, Object Lock attivo |
| Retention predefinita S3 | COMPLIANCE, fissa, 365 giorni, configurazione confermata dall’utente |

Il funzionamento della retention su una specifica versione di oggetto non è stato verificato: nessun oggetto è stato caricato. Non è stato configurato o verificato un legal hold.

## Software e controlli

| Software | Versione osservata |
|---|---|
| SQLite e libreria | 3.40.0-1.amzn2023.0.8, Amazon Linux |
| chrony | 4.3-1.amzn2023.0.6 |
| ClockBound daemon | 2.0.3, compilato con Cargo usando `--locked` |
| ClockBound client | 2.0.3; dipendenze clock-bound-shm e clock-bound-vmclock 2.0.3 |
| Rust / Cargo | 1.98.0-1.amzn2023 |
| GCC | 11.5.0-5.amzn2023.0.5 |

Chrony usa Amazon Time Sync link-local; `maxclockerror 50` è configurato in un file dedicato. ClockBound usa `--max-drift-rate 50`, l’utente di servizio chrony e VMClock. Il dispositivo VMClock esiste e il file di memoria condivisa è stato creato. Entrambi i servizi risultavano attivi dopo il secondo avvio.

È stato creato sull’host, fuori dal repository Phoenix, un piccolo programma diagnostico che chiama il client ufficiale una sola volta e stampa stato e limiti temporali. Non è un servizio PCTR né un harness di conformance.

Risultato composito documentato (CHAT-02), non un unico output originale:

1. **Estremi provenienti dall’output diagnostico trascritto dall’utente:**

```text
earliest: tv_sec=1790017361, tv_nsec=664212984
latest:   tv_sec=1790017361, tv_nsec=666611438
```

2. **Stato comunicato separatamente dall’utente:** `Synchronized`. La riga era omessa nel primo messaggio e fornita nella risposta successiva, senza una nuova esecuzione richiesta.

3. **Ampiezza derivata mediante calcolo locale:** `(1790017361 - 1790017361) × 1000000000 + (666611438 - 664212984) = 2398454 ns = 2,398454 ms`. Non era una riga emessa dal diagnostico.

La misura resta un risultato tecnico puntuale: nessuna soglia valutata, conformità, certificazione o soddisfacimento T01–T33.

Questo riscontro dimostra una lettura riuscita in quell’istante. Non dimostra accuratezza continua, comportamento in ogni guasto, conformità T01–T33 o idoneità di un futuro sistema PCTR. Non sono stati eseguiti test transazionali SQLite. Lo spazio radice osservato prima del secondo avvio era 16G totali, 2.6G usati e 14G disponibili, con arrotondamenti di `df`.

## Impronte SHA-256 riportate dall’host

| File sull’host | SHA-256 |
|---|---|
| `/usr/local/bin/clockbound` | `910f6e657d702b475f07f5c82e4a190ca7cbb3c3138d7aa022d7d9e5d1f818b2` |
| `/etc/chrony.d/phoenix-clockbound.conf` | `ee2c03b821b75c9d08a91e1345cbca07add3157233df08a613f46845ebb884f2` |
| `/etc/systemd/system/clockbound.service` | `ec126217fe2434e4bbe0a9338df2d497023113b6efe8fbfaf0e2bc60259b8999` |
| `/usr/local/bin/phoenix-clockbound-check` | `37b7d7a657c672961306ae2fdc008847329fbeb572afe1d575ff79f9d3420f1b` |
| `[HOST_USER_HOME]/phoenix-clockbound-check/Cargo.lock` | `63bd5e027585497464cac0f8831577ec0061fcf22d53bfcfb6319ebe98466a16` |

Le impronte sono registrazioni degli output forniti, non firme del produttore né prova autonoma della provenienza dei binari. Il lockfile del diagnostico è stato generato durante la compilazione e poi identificato tramite hash.

## Tempo EC2

Orari del 21 settembre 2026, tutti UTC:

| Periodo | Avvio | Richiesta di arresto | Intervallo documentato |
|---|---|---|---|
| 1 | 13:04:19 | 13:43:39 | 39 min 20 s |
| 2 | 18:38:30 | 19:05:21 | 26 min 51 s |
| Totale | | | 1 h 6 min 11 s |

Gli orari finali di completamento degli arresti non sono disponibili. Pertanto il totale non è il tempo fatturato definitivo; il residuo non può essere certificato al secondo. Per pianificazione si riservano cautelativamente 2 ore consumate, lasciando al massimo 70 ore per ulteriori attività, salvo riconciliazione dei tempi effettivi. Questa riserva è una scelta contabile prudenziale, non una misura AWS.

## Costi

La verifica preventiva nel calcolatore AWS ha restituito:

| Voce e quantità preventivata | USD |
|---|---:|
| t3.micro Linux, 72 ore a 0.0132 USD/h | 0.9504 |
| Un IPv4 pubblico, 72 ore a 0.005 USD/h | 0.3600 |
| gp3, 16 GiB per un mese a 0.1142 USD/GB-mese | 1.8272 |
| S3, 1 GB-mese + 10.000 PUT + 100.000 GET | 0.12395 |
| Trasferimento Internet EC2, 1 GB | 0.0900 |
| Totale preventivo, prima delle imposte | **3.35155** |

Non sono stati applicati sconti Free Tier al preventivo. Non è stato acquisito il consuntivo Billing: non si può attestare la spesa effettiva. EBS continua a essere fatturabile durante l’arresto. Eventuali futuri oggetti protetti per 365 giorni comporteranno costi di conservazione oltre il primo mese, non compresi in questo totale. Il limite di 10 USD resta invariato e richiede controllo della spesa; i budget non la arrestano automaticamente.

## Limiti e attività residue

- Nessuna evidenza caricata in S3, nessun VersionId o termine di retention di oggetto acquisito.
- Consuntivo AWS e durata completa degli arresti non ancora riconciliati.
- Pacchetti e binari identificati per versione; non è stata dimostrata una compilazione riproducibile né applicato un blocco permanente agli aggiornamenti del sistema.
- Alcune viste console accessorie hanno restituito AccessDenied; non è stata ampliata l’autorizzazione per eliminare ogni avviso grafico. I controlli di stato EC2 hanno mostrato 3/3 riusciti e Session Manager ha funzionato.

## Confine di governance

Nessuna implementazione PCTR, esecuzione T01–T33, enrollment reale, allocazione di identificatori Phoenix, Authority Registry, R0 operativo, Genesis, C/G1, nomina di holder, chiusura autoritativa di findings o certificazione. Nessuna modifica al repository Phoenix, commit o push da queste operazioni. Le modifiche sull’host riguardano dipendenze, configurazioni di servizio e diagnostico di preparazione.

**Nota storica:** la preparazione locale proposta nel rapporto originale è realizzata da questo pacchetto. Nessun upload S3 eseguito o disposto.

## CD7 — Chiusura documentale del 23 settembre 2026

**P05 — CLOSED: TECHNICAL PREPARATION AND DOCUMENTARY RECORD**

**AWS FINAL ECONOMIC RECONCILIATION — OPEN**

Chiusura limitata alla missione `P05-AP09A-INFRA-PREP-1`, sulla base della sufficienza economica accettata dall’utente e dell’autorizzazione P05-CD7. Le sezioni precedenti conservano i riscontri storici del 21 settembre: l’assenza allora dichiarata di dati Billing è aggiornata dai dati seguenti. Non è una nuova verifica AWS. L’ultimo stato EC2 documentato resta Stopped, come fatto storico.

Il rapporto e `outstanding-evidence.md` canonici diventano derivati successivi e non sono più byte-identical alle sorgenti del pacchetto locale `1.0-r1`, che resta invariato. `provenance.csv` aggiorna la canonical adaptation; `clockbound-observation.json` resta invariato. Il digest del checksum manifest locale `3cd02c0220165094850f2ba41b873a9f39f528c74f7961117e0e2787d5de7b57` identifica quel pacchetto storico, non questi derivati.

### Evidenza economica disponibile

CSV Cost Explorer forniti dall’utente, conservati esclusivamente LOCAL-ONLY fuori dal repository: `costs (5).csv`–`costs (12).csv`; hash dei byte effettivamente disponibili in `provenance.csv` (COST-01–COST-08). Periodo delle righe: 21–22 settembre 2026. Timestamp di esportazione e filtri completi non sono incorporati nei CSV e non vengono ricostruiti. Il contesto di consultazione proviene dalla conversazione, non da metadati inventati.

| Usage prima dei crediti | USD |
|---|---:|
| EBS gp3 | 0.088822223 |
| EC2 t3.micro | 0.0145383348 |
| IPv4 | 0.005555555 |
| S3 | 0.00015869 |
| Totale | 0.1090748028 |
| Crediti osservati, separati dal consumo | -0.1090747932 |
| Saldo osservato dopo crediti | 0.0000000096 |

Il saldo quasi nullo non rappresenta consumo gratuito né fattura definitiva. Per il confronto prudenziale con il cap si usa tutto l’Usage osservato prima dei crediti, senza ridurlo con i crediti. L’attribuzione esclusiva a P05 non è dimostrata: il tag di missione non era disponibile. La variazione tra letture comunicata dall’utente segnala contabilizzazione tardiva; non dimostra che gli addebiti siano ormai completi. Il CSV `costs (12).csv` espone zero senza una dimensione identificabile: non annulla l’Usage S3 positivo negli altri export, mantenuto prudenzialmente.

### Previsione e confronto con il limite

Orizzonte di pianificazione: primo mese di 30 giorni dal **2026-09-21 13:04:19 UTC al 2026-10-21 13:04:19 UTC**, senza rinnovo implicito. Ipotesi: EC2 resta arrestata, volume gp3 da 16 GiB e tariffa invariati, nessuna nuova risorsa o caricamento. Quantità EBS osservata: `0.777777777 GB-Month`; equivalente mensile EBS già calcolato: `1.8272 USD`. La proiezione non è una nuova quotazione AWS.

| Calcolo prudenziale | USD |
|---|---:|
| Usage maturato disponibile, prima dei crediti | 0.1090748028 |
| EBS per l’intero orizzonte | 1.827200000 |
| EBS già incluso nell’Usage, da sottrarre | -0.088822223 |
| EBS residuo nell’orizzonte | 1.738377777 |
| Base: Usage + EBS residuo | 1.8474525798 |
| Riserva S3/storage/richieste residue | 1.0000000000 |
| Riserva billing lag/altri utilizzi non ancora esposti, escluso EBS già proiettato | 1.0000000000 |
| Riserva imposte/differenze di fatturazione | 1.0000000000 |
| Totale prudenziale | **4.8474525798** |
| Cap autorizzato | **10.0000000000** |
| Margine residuo | **5.1525474202** |

L’EBS già maturato è contato una sola volta. Il residuo comprende anche utilizzo successivo al 22 settembre eventualmente già maturato ma non esposto: non è interamente futuro alla data della sintesi. Le tre riserve sono assunzioni di pianificazione accettate, non costi misurati, tariffe, limiti garantiti o ulteriori autorizzazioni di spesa. Imposte effettive e contenuto S3 attuale non sono determinati; la sufficienza economica è prudenziale, non verifica definitiva della fattura o garanzia del cap. La conservazione oltre questo orizzonte richiede una decisione separata.

### Sufficienza e residui accettati

**SUFFICIENT TO CLOSE P05**, esclusivamente per preparazione tecnica e registrazione documentale. Restano accettati come non bloccanti: billing provvisorio e lag, attribuzione incompleta, imposte/crediti finali non riconciliati, export a zero non risolto, ipotesi di conservazione e gli altri limiti elencati in [outstanding-evidence.md](outstanding-evidence.md). La futura riconciliazione AWS dovrà distinguere Usage, crediti, imposte, periodo, attribuzione e costi di conservazione, registrando eventuali scostamenti. Nessun ulteriore accesso AWS è autorizzato da questa chiusura.

| Assessment / Status | Value |
|---|---|
| AP-09A | NOT COMPLETED |
| T01–T33 | NOT EXECUTED |
| Threshold assessment | NOT PERFORMED |
| Conformance | NOT PERFORMED |
| Certification | NOT PERFORMED |
| Governance effects | NONE |

ClockBound resta una singola osservazione tecnica: estremi diagnostici, stato Synchronized comunicato separatamente e ampiezza calcolata 2.398454 ms. Nessun protected enrollment, implementazione PCTR, Genesis/R0, C/G1, A09 freeze o A10 viene attestato o autorizzato.
