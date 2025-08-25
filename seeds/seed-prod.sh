#!/usr/bin/env bash
set -euo pipefail

command -v jq >/dev/null 2>&1 || { echo "❌ Chybí jq (brew install jq / choco install jq / apt install jq)"; exit 1; }

# načti .env.prod
set -a
source "$(dirname "$0")/.env.prod"
set +a

BASE="$(dirname "$0")"
OUT_DIR="$BASE/out"
JSON_DIR="$OUT_DIR/json"
ASSETS_DIR="$OUT_DIR/assets"

hdr=(-H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")

api_json () { curl -sS -f "${hdr[@]}" "$@"; }
api_up   () { curl -sS -f -H "Authorization: Bearer ${TOKEN}" "$@"; }

upsert_single () {
  local type="$1"; local file="$2"
  [ -s "$file" ] || { echo "  (vynecháno: $type – chybí $file)"; return 0; }
  echo "→ upsert single: $type"
  if api_json -X GET "${URL}/api/${type}" | jq -e '.data != null' >/dev/null 2>&1; then
    api_json -X PUT "${URL}/api/${type}" -d "{\"data\": $(cat "$file")}" >/dev/null
  else
    api_json -X POST "${URL}/api/${type}" -d "{\"data\": $(cat "$file")}" >/dev/null
  fi
  echo "  ✓ $type hotovo"
}

create_pages () {
  local list="${JSON_DIR}/pages.json"
  [ -s "$list" ] || { echo "  (vynecháno: pages – chybí $list)"; return 0; }
  echo "→ vytvářím Pages"
  jq -c '.items[]' "$list" | while read -r row; do
    title=$(echo "$row" | jq -r '.title // empty')
    echo "  + $title"
    api_json -X POST "${URL}/api/pages" -d "{\"data\": ${row}}" >/dev/null || true
  done
  echo "  ✓ Pages hotovo"
}

upload_assets () {
  [ -d "$ASSETS_DIR" ] || { echo "  (vynecháno: assets – složka neexistuje)"; return 0; }
  echo "→ upload assets"
  shopt -s nullglob
  for f in "$ASSETS_DIR"/*; do
    name=$(basename "$f")
    echo "  ↑ $name"
    api_up -F "files=@${f}" "${URL}/api/upload" >/dev/null || true
  done
  echo "  ✓ assets hotovo"
}

echo "▶ Upload obrázků (pokud existují)…"
upload_assets

echo "▶ Upsert single types…"
upsert_single "home"      "${JSON_DIR}/home.json"
upsert_single "developer" "${JSON_DIR}/developer.json"
upsert_single "about"     "${JSON_DIR}/about.json"

echo "▶ Vytvoření Pages (pokud používáš)…"
create_pages

echo
echo "✅ Import hotový."