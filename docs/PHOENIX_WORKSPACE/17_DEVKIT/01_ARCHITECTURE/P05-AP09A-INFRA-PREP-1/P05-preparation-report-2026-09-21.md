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
