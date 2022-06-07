#!/bin/bash

if [[ "$@" = 'bash' ]]; then
    # use case: want to shell into the container to inspect state
		bash

else 
    /formatter/bin/dbt-formatter "$@"

fi