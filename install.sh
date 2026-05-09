#!/bin/bash
set -u

sdir=$(dirname "$0")   # Output: /home/user/scripts§
dest=$1

echo "Script directory: $sdir"
echo "Dest directory: $dest"

for f in .github LICENSE .ai robots.txt
do
  cp -r "${sdir}/${f}" $dest
done


touch "${dest}/README.md"
cat "${sdir}/README.md" "${dest}/README.md" | tee "${dest}/README.md" > /dev/null

