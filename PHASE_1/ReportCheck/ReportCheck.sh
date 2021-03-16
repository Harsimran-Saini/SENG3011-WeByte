#!/bin/dash
#make sure the only txt files in the directory are files you want to check
diseases=$(ls $PWD | grep -E '*.txt$')
for entry in $diseases;
do
  echo $entry
  name=$(echo $entry | sed -e 's/.txt//g' )
  fname="Check_$name.txt"
  echo $fname
  #run python report check
  python3 ReportCheck.py $entry > $fname

  if [ -s $fname ]
  then
    #do nothing
    echo "$entry has no errors"

  else
    rm -f $fname
  fi


done

#zip up all the error files
zip ErrorFiles Check_*
