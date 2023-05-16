@echo off

rem This script will automate git commit in Windows.

rem Get the current working directory.
set current_directory=%cd%

rem Check if the current directory is a git repository.
if not exist "%current_directory%\.git" (
  echo "The current directory is not a git repository."
  exit /b 1
)

rem Get the current branch.
for /f "delims=" %%i in ('git branch') do (
  set current_branch=%%i
)

rem Commit all changes in the current branch.
git commit -am "Automated commit from %DATE%"

rem Push the changes to the remote repository.
git push

rem

