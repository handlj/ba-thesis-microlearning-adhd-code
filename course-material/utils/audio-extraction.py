#!/usr/bin/env python3
"""
Audio Extraction Script
Extracts audio from a video file into separate .wav files.

Requires:
    - Python (run on version 3.13.12)
    - ffmpeg and ffprobe

Usage:
    python audio-extraction.py /path/to/video.mp4
    python audio-extraction.py /path/to/video.mp4 -o /path/to/output/dir

Author:
    Jan S. Handler

AI Notice:
    This script was generated with the assistance of an AI language model:
    (GitHub Copilot Pro (Student Edition))
"""

import sys
import argparse
import subprocess
from pathlib import Path
import json


def get_audio_streams(video_path: str) -> list:
    """
    Get information about all audio streams in a video file.
    
    Args:
        video_path (str): Path to the video file
    
    Returns:
        list: List of dictionaries containing audio stream information
    """
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-select_streams', 'a',
            '-show_entries', 'stream=index,codec_type,channels,sample_rate,language,title',
            '-of', 'json',
            video_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        return data.get('streams', [])
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to probe video file: {e.stderr}")
    except Exception as e:
        raise Exception(f"Error analyzing video: {e}")


def extract_audio(video_path: str, output_dir: str = None) -> list:
    """
    Extract all audio streams from a video file into separate .wav files.
    
    Args:
        video_path (str): Path to the video file
        output_dir (str, optional): Directory for output files. 
                                   Defaults to same directory as video
    
    Returns:
        list: List of paths to extracted audio files
    
    Raises:
        FileNotFoundError: If the video file doesn't exist
        Exception: If extraction fails
    """
    
    # Validate input file exists
    video_file = Path(video_path)
    if not video_file.exists():
        raise FileNotFoundError(f"Video file not found: {video_path}")
    
    # Set output directory if not provided
    if output_dir is None:
        output_dir = str(video_file.parent)
    
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading video: {video_path}")
    print(f"Output directory: {output_dir}")
    print()
    
    try:
        # Get audio stream information
        audio_streams = get_audio_streams(video_path)
        
        if not audio_streams:
            print("No audio streams found in the video file.")
            return []
        
        print(f"Found {len(audio_streams)} audio stream(s)")
        print()
        
        extracted_files = []
        
        # Extract each audio stream
        for i, stream in enumerate(audio_streams):
            stream_index = stream.get('index')
            language = stream.get('tags', {}).get('language', 'unknown')
            title = stream.get('tags', {}).get('title', f'audio_{i}')
            
            # Create output filename
            base_name = video_file.stem
            if len(audio_streams) > 1:
                output_filename = f"{base_name}_audio_{i}_{language}.wav"
            else:
                output_filename = f"{base_name}_audio.wav"
            
            output_file = output_path / output_filename
            
            print(f"Extracting stream {stream_index} ({language}) -> {output_filename}")
            
            try:
                cmd = [
                    'ffmpeg',
                    '-i', str(video_file),
                    '-map', f'0:a:{i}',
                    '-acodec', 'pcm_s16le',
                    '-ar', '44100',
                    '-y',
                    '-loglevel', 'error',
                    str(output_file)
                ]
                
                subprocess.run(cmd, check=True, capture_output=True)
                extracted_files.append(str(output_file))
                file_size = output_file.stat().st_size / (1024 * 1024)
                print(f"  Saved: {output_file} ({file_size:.2f} MB)")
                
            except subprocess.CalledProcessError as e:
                print(f"  Error extracting stream {stream_index}: {e.stderr}")
                continue
        
        print()
        if extracted_files:
            print(f"Extraction complete! {len(extracted_files)} audio file(s) extracted.")
            return extracted_files
        else:
            print("No audio files were successfully extracted.")
            return []
    
    except Exception as e:
        print(f"Extraction failed: {e}")
        raise


def main():
    """Main entry point for the script."""
    
    parser = argparse.ArgumentParser(
        description="Extract audio from a video file into separate .wav files"
    )
    parser.add_argument(
        "video_path",
        help="Path to the video file"
    )
    parser.add_argument(
        "-o", "--output",
        help="Output directory (default: same directory as video)",
        default=None
    )
    
    args = parser.parse_args()
    
    # Check if ffmpeg and ffprobe are available
    for tool in ['ffmpeg', 'ffprobe']:
        try:
            subprocess.run([tool, '-version'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"Error: {tool} is not installed or not in PATH")
            print("Please install ffmpeg:")
            print("  Ubuntu/Debian: sudo apt-get install ffmpeg")
            print("  macOS: brew install ffmpeg")
            print("  Windows: choco install ffmpeg (or download from ffmpeg.org)")
            sys.exit(1)
    
    try:
        extract_audio(args.video_path, args.output)
    except FileNotFoundError as e:
        print(f"{e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
