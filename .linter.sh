#!/bin/bash
cd /home/kavia/workspace/code-generation/travelgenie-ai-55-ab562116/travelgenie_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

