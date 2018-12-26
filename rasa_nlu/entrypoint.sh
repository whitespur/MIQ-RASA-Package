#!/bin/bash

set -e

function print_help {
    echo "Available options:"
    echo " help                       - Print this help"
    echo " train-nlu                  - Train a dialogue model"
    echo " train-agent                - Train a dialogue model"
    echo " run                        - Run agent"
}

        exec python -m rasa_core.run -d models/current/dialogue -u models/current/nlu_model

