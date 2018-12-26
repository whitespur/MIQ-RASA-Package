#!/bin/bash

set -Eeuo pipefail

function print_help {
    echo "Available options:"
    echo " start commands (Rasa Core cmdline arguments) - Start Rasa Core server"
    echo " train                                        - Train a dialogue model"
    echo " start -h                                     - Print Rasa Core help"
    echo " help                                         - Print this help"
    echo " run                                          - Run an arbitrary command inside the container"
}
    exec python -m rasa_core.train -s /app/data/stories.md -d /app/config/domain.yml -o /app/model "${@:2}"

