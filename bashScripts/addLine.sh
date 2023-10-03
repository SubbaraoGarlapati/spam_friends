#!/bin/bash

number=$1

if ! grep -q $number /home/ubuntu/recipients.txt
then
        echo $number >> /home/ubuntu/recipients.txt
fi
