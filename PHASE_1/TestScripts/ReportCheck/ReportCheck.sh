#!/bin/dash

#Dump all the data text files to be checked into the directory DataCheck
cd $PWD/DataCheck
diseases=$(ls $PWD | grep -E '*.txt$')
mkdir 'no_articles'
mkdir 'no_reports'
for entry in $diseases;
do
  echo "\n"
  echo "-----------------------------------------------------------------------"
  echo "checking $entry"
  name=$(echo $entry | sed -e 's/.txt//g' )
  fname="Check_$name.txt"


  #run python report check
  python3 ../ReportCheck.py $entry > $fname
  exitCode=$?
  if [ $exitCode -eq 4 ];
  then
    mv $fname 'no_articles'

  elif [ $exitCode -eq 3 ];
  then
    mv $fname 'no_reports'
  elif [ $exitCode -eq 0 ];
  then
    :
  else
    echo '\n'
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "Python script broke on $entry"
    echo $exitCode
    exit $?

  fi

  if [ -s $fname ]
  then
    #do nothing
    echo "$entry has no errors"

  else
    echo "$entry has errors, logging errors into $fname"
    rm -f $fname
  fi
  echo "-----------------------------------------------------------------------"

done

echo "\n"
#zip up all the error files
z=$(zip -r ErrorFiles no_articles no_reports 2>/dev/null)
if [ $? -eq 12 ];
then
   echo "No errors found in data files"
else
  echo "All error logs are zipped in ErrorFiles.zip"
fi

#remove directories
rm -r no_articles no_reports
mv ErrorFiles.zip ..
