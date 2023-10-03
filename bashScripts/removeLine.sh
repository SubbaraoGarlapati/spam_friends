#!/bin/bash

number=$1

grep -v $number /home/ubuntu/recipients.txt > tmpFile
mv tmpFile /home/ubuntu/recipients.txt
