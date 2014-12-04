#!/bin/bash

function runManyInstancesTogether {
	node concurrencyTestReset.js

	for i in `seq 3`; do
		node concurrencyTest.js $1 &
	done

	wait
}

function runAllTestIterations {
	for i in `seq 250`; do
		echo -n . >&2
		runManyInstancesTogether $1
	done
}

NUM_MISMATCHES=`runAllTestIterations $1 | wc -l`
echo
echo "Total mismatches: $NUM_MISMATCHES"

