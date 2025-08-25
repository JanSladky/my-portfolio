#!/usr/bin/env bash
set -euo pipefail

# Požaduje: jq a curl
command -v jq >/dev/null 2>&1 || { echo "❌ Chybí jq (brew install jq / choco install jq / apt install jq)"; exit 1; }

# načti .env.local
set -a
source "$(dirname "$0")/.env.local"
set +a

OUT_DIR="$(dirname "$0")/out"
JSON_DIR="$OUT_DIR/json"
ASSETS_DIR="$OUT_DIR/assets"

mkdir -p "$JSON_DIR" "$ASSETS_DIR"

hdr=(-H "Authorization: Bearer ${LOCAL_TOKEN}")

api_json () {
  curl -sS -f "${hdr[@]}" -H "Content-Type: application/json" "$@"
}

echo "▶ Export single types (developer, home, about pokud existuje)…"

# developer
api_json "${LOCAL_URL}/api/developer?populate=*" \
  | jq '.data.attributes
        | del(.createdAt,.updatedAt,.publishedAt,.createdBy,.updatedBy)' \
  > "${JSON_DIR}/developer.json" || true

# home
api_json "${LOCAL_URL}/api/home?populate=*" \
  | jq '.data.attributes
        | del(.createdAt,.updatedAt,.publishedAt,.createdBy,.updatedBy)' \
  > "${JSON_DIR}/home.json" || true

# about (pokud máš)
api_json "${LOCAL_URL}/api/about?populate=*" \
  | jq '.data.attributes
        | del(.createdAt,.updatedAt,.publishedAt,.createdBy,.updatedBy)' \
  > "${JSON_DIR}/about.json" || true

echo "▶ Export collection typu Pages (pokud ho používáš)…"
api_json "${LOCAL_URL}/api/pages?pagination[pageSize]=200&populate=*&publicationState=preview" \
  | jq '{items: [.data[]
        | { title: .attributes.title,
            slug: .attributes.slug,
            content_html: .attributes.content_html } ]}' \
  > "${JSON_DIR}/pages.json" || true

echo "▶ Export media knihovny (upload/files)…"
FILES_JSON="${JSON_DIR}/files.json"
api_json "${LOCAL_URL}/api/upload/files?pagination[pageSize]=200" > "$FILES_JSON" || true

# stáhni všechny soubory do out/assets
jq -r '.[].url' "$FILES_JSON" 2>/dev/null | while read -r url; do
  [ -z "$url" ] && continue
  # URL může být absolutní nebo relativní
  if [[ "$url" == http* ]]; then
    SRC="$url"
  else
    SRC="${LOCAL_URL}${url}"
  fi
  NAME="$(basename "$url" | sed 's/[?].*$//')"
  DEST="${ASSETS_DIR}/${NAME}"
  echo "  ↓ $NAME"
  curl -sS -f -L "$SRC" -o "$DEST" || true
done

echo
echo "✅ Export hotový → $(realpath "$OUT_DIR")"