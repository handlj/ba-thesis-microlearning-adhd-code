#!/bin/bash

# Transcribtion script for extracting text from audio files
# Usage: ./transcribe.sh path/to/audiofile
# 
# This script uses OpenAI's Whisper model to transcribe audio files.
# Make sure you have the Whisper CLI installed and configured properly.

# Input file (first argument)
AUDIO_FILE="$1"

# Run Whisper
whisper "$AUDIO_FILE" --model small --language de
