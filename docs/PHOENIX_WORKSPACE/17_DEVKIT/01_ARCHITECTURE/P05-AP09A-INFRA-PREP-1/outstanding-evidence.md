# Gap ancora aperti
1. Costo AWS effettivo: dati Billing con periodo, valuta, servizio, imposte e crediti non acquisiti. Nessuna interrogazione AWS effettuata ora.
2. Tempi finali di arresto ignoti: 3971 secondi è il tempo fino alle richieste, non la durata fatturata definitiva.
3. S3: nessun upload, VersionId, checksum o retention verificata per oggetto; nessun legal hold configurato o verificato. Pacchetto locale non WORM.
4. Export finali IAM/rete/storage non acquisiti. Nome policy S3 differente da proposta; JSON finale completo non esportato.
5. Artefatti host non acquisiti: binari, sorgente diagnostico e lockfile; disponibili hash riportati e ricostruzioni. Riproducibilità della build e blocco aggiornamenti non dimostrati.
6. Misura ClockBound puntuale: Synchronized e 2,398454 ms; nessuna soglia valutata, test continuo o di guasto, conformità o certificazione. T01–T33 non eseguiti.
7. SQLite: versione e provenienza osservate, nessun test transazionale.
8. Messaggi della conversazione senza export stabile/timestamp acquisito: nessun hash artificiale.

Tutti i gap restano aperti. Nessun finding, requisito o stato di governance viene chiuso. Possibili acquisizioni future richiedono il relativo perimetro autorizzato; nessuna è eseguita in questa fase.
