#!/bin/bash 

source ./scripts/standard-lib.sh

exit_if_empty "foo" "sorry bad luck"

echo "HI"