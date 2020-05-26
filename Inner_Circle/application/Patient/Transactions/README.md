## These applicaion while directly connect to the blockchain via a gateway by using the certificate and private keys of the respective admin/user. 

### Note: Files starting with '0_hardcode_' are test applications, ignore them.

##The following are the applications and their uses:

1. RegisterUser.js - This is used to register a patient. The following details have to given as input parameters (as String type) to the application - Patient first name, patient ID, patient last name, patient DOB (in yyyy-mm-dd format), patient Email, patient contact number1, patient contact number 2 (optional but if not passing, pass an empty string), patient address and patient blood group. Example (issue command from Patient directory): node Transactions/RegisterPatient.js Chris 12345 Pinto 1997-12-06 cpinto4u@gmail.com 9986981226 8762626326 Kadri,\ Mangalore A+

2. GetPersonalDetails.js - This is used to get the details of the patient which have already been sent to the blockchain via application 1. The following details have to be given as input parameters (as String type) to the application - Patient first name and patient ID. Example (issue command from Patient directory): node Transactions/GetPersonalDetails.js Chris 12345

