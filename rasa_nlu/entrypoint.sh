#!/bin/bash

set -e

function print_help {
    echo "Available options:"
    echo " help                       - Print this help"
    echo " train-nlu                  - Train a dialogue model"
    echo " train-agent                - Train a dialogue model"
    echo " run                        - Run agent"
}
    exec python -m rasa_nlu.train -c /app/config/config.yml -d /app/data/nlu_data.md -o /app/projects/current/nlu_model

