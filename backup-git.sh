#!/usr/bin/env bash
set -e

# 1) Vai nella cartella del progetto
cd ~/Documents/GitHub/ifinditforyou-new

echo "== iFindItForYou backup automatico =="

# 2) Mostra lo stato
git status

# 3) Aggiungi tutte le modifiche
git add .

# 4) Crea un commit con data/ora (se ci sono modifiche)
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
if git commit -m "Backup automatico $TIMESTAMP"; then
  echo "Commit creato: Backup automatico $TIMESTAMP"
else
  echo "Nessuna modifica da committare."
fi

# 5) Push su main
git push origin main

echo "== Backup completato su GitHub =="

