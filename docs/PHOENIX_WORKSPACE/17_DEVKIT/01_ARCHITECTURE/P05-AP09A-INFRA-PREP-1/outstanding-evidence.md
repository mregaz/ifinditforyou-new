# Gap ancora aperti — aggiornamento CD7, 23 settembre 2026

**P05 — CLOSED: TECHNICAL PREPARATION AND DOCUMENTARY RECORD**

**AWS FINAL ECONOMIC RECONCILIATION — OPEN**

Questo documento canonico è un derivato successivo, non più byte-identical alla sorgente locale `1.0-r1`; il pacchetto locale resta invariato. La chiusura documentale P05 non risolve automaticamente i gap. Base economica e calcoli nel [rapporto P05](P05-preparation-report-2026-09-21.md), fonti e limiti in [provenance.csv](provenance.csv).

## Residui accettati come non bloccanti per P05

1. Riconciliazione economica finale AWS aperta: disponibili Usage e crediti Cost Explorer per 21–22 settembre, non una fattura definitiva. Restano billing lag, imposte non determinate, attribuzione P05 incompleta in assenza del tag, verifica finale di crediti e costi di conservazione. L’export `costs (12).csv` a zero non sostituisce il costo S3 positivo; tutti gli export sono LOCAL-ONLY. Il totale prudenziale di 4.8474525798 USD e il margine di 5.1525474202 USD dipendono dalle ipotesi e riserve del rapporto, non garantiscono il consuntivo. La riconciliazione successiva dovrà registrare eventuali scostamenti senza assimilarsi a certificazione. L’orizzonte termina il 21 ottobre 2026 alle 13:04:19 UTC; conservazione successiva da decidere separatamente.
2. Tempi finali di arresto ignoti: 3971 secondi è il tempo fino alle richieste, non la durata fatturata definitiva. EC2 Stopped è l’ultimo stato documentato, non verificato ora.
3. Export finali IAM/rete/storage non acquisiti. Nome policy S3 differente dalla proposta; JSON finale completo non esportato.
4. Artefatti host non acquisiti: binari, sorgente diagnostico e lockfile; disponibili hash riportati e ricostruzioni. Riproducibilità della build e blocco aggiornamenti non dimostrati.
5. Messaggi della conversazione senza export stabile/timestamp acquisito: nessun hash artificiale. I CSV non attestano autonomamente tutti i filtri della console o la specifica risorsa.

## Limiti tecnici e attività successive, non soddisfatti dalla chiusura P05

6. S3: nessun upload di evidenze, VersionId, checksum o retention verificata per oggetto; nessun legal hold configurato o verificato. Pacchetto locale non WORM.
7. ClockBound: singola osservazione, estremi diagnostici e Synchronized comunicato separatamente; 2.398454 ms è ampiezza calcolata. Nessun test continuo o di guasto, threshold assessment, conformance o certification.
8. SQLite: versione e provenienza osservate, nessun test transazionale.

AP-09A **NOT COMPLETED**; T01–T33 **NOT EXECUTED**; Threshold assessment **NOT PERFORMED**; Conformance **NOT PERFORMED**; Certification **NOT PERFORMED**; Governance effects **NONE**.

Questi limiti restano aperti, senza introdurre retroattivamente nuovi criteri di accettazione P05. Nessuna chiusura autoritativa di finding, protected enrollment, PCTR, Genesis/R0, C/G1, A09 freeze o A10. Nessuna ulteriore operazione AWS è autorizzata; future acquisizioni richiedono un perimetro autorizzato separato.
