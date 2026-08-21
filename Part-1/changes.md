# Changed
importing dscrd -> discord  
The reason why the bot wasnt returning status is that we were reading status from data array that only contained another array which containded the correct data, ive made change to read the correct array from data array to service_status array and changed it later to read from the correct array
# Improvements
Loading token and key from dotenv, I’m getting PTSD from looking at that  
Addid expection catching to handle the errors cleanly