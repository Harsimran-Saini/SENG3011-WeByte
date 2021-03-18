import psycopg2
import json
import sys

if __name__ == "__main__":
    if len(sys.argv != 1):
        print("Usage: python3 uploadDatafile.py [filepath]")
        exit(1)
    
    dataFile= open(sys.argv[1])
    for line in dataFile:
        print(line)