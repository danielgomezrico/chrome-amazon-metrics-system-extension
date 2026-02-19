#!/bin/sh
HOOK=.git/hooks/commit-msg
cat > "$HOOK" << 'EOF'
#!/bin/sh
npx --no -- commitlint --edit "$1"
EOF
chmod +x "$HOOK"
echo "Git hooks installed."
