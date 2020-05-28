# Applications Explaination

## These applicaion while directly connect to the blockchain via a gateway by using the certificate and private keys of the respective admin/user. 

### Note: Not all organizations have access to all applications. For example, a PHC cannot register a patient, only a patient can.

## The following are the applications and their uses (Note: Do not forget to run npm install if there is no node_modules directory in the application directory).

# Transactions (changes the state of the ledger):

1. RegisterUser.js (Can be used ONLY by a patient) - This is used to register a patient. The following details have to given as input parameters (as String type) to the application - Patient first name, patient ID, patient last name, patient DOB (in yyyy-mm-dd format), patient Email, patient contact number1, patient contact number 2 (optional but if not passing, pass an empty string), patient address and patient blood group. Example (issue command from <b>Patient directory</b>): node Transactions/RegisterPatient.js Chris 12345 Pinto 1997-12-06 cpinto4u@gmail.com 9986981226 8762626326 Kadri,\ Mangalore A+ (note: on terminal "\ " would indicate a space in the text fields passed to the application). 

2. RequestPHC.js (Can be used ONLY by a patient) - This is used by a patient to request for a PHC check-up. The following details have to be given as input parameters (as String type) to the application: Patient first name, patient ID and reason for the check-up. Example (issue command from <b>Patient directory</b>): node Transactions/GetPersonalDetails.js Chris 12345 Regular\ check-up

3. PHCTreatment.js (Can be used ONLY by a PHC) - This is used by a PHC if a check-up or treatment has successfully been undertaken at a PHC. Incase if check-up is unsuccesful or complications arise, transaction 4 needs to be used by the PHC and not transaction 3. The following details have to be given as input parameters (as String type) to the application: Patient first name, Patient ID, Treating Organization, Treated By Contact, Treated By Email, Treated By User ID, Treated By Local ID and Treatment Summary. Example (issue command from <b>PHC directory</b>): node Transactions/PHCTreatment.js Chris 12345 ManipalPHC 1234567890 something@gmail.com 98765 23456 Gave\ some\ antibiotics 

4. Referral.js (Can be used ONLY by a PHC) - This is used by a PHC incase they need to refer a patient to a government hospital because of reasons such as complications or lack of facilities. The following details have to be given as input parameters (as String type) to the application: Patient First Name, Patient ID, ReferralID, Referring Organization, Referred By Contact, Referred By Email, Referred By UserID, Referred By LocalID, Referred To Contact, Referred To Email, Referred To UserID, Referred To LocalID, Referral Reason (Enumeration of 11 characters), Referral Note, Referral Priority Flag(E - Emergency or N - Normal). Example (issue command from <b>PHC directory</b>): node Transactions/Referral.js Chris 12345 23455 ManipalPHC 1234567890 something@gmail.com 43121 53244 9889845362 somethingelse@gmail.com 87564 83342 A Severe\ Internal\ Bleeding E

5. GovtHosTreatment.js (Can be used ONLY by a government hospital) - This is very similar to transaction 3 but in the case where a patient was first referred and then treated at the government hospital. The following details have to be given as input parameters (as String type) to the application: Patient first name, Patient ID, Treating Organization, Treated By Contact, Treated By Email, Treated By User ID, Treated By Local ID and Treatment Summary. Example (issue command from <b>PHC directory</b>): node Transactions/PHCTreatment.js Chris 12345 KMC 1234567890 somethinggg@gmail.com 98765 23456 Had\ to\ operate\ to\ contain\ the\ bleeding

## The states of a patient can go in two ways:
### 1) Registered -> Requested -> Treated
### 2) Registered -> Requested -> Referred -> Referred and Treated

# Queries (does not change the state of the ledger):

1. GetPersonalDetails.js (Can be used by any organization) - This is used to get the details of the patient which have already been sent to the blockchain via application 1. The following details have to be given as input parameters (as String type) to the application - Patient first name and patient ID. Example (issue command from Patient directory): node Transactions/GetPersonalDetails.js Chris 12345

1. GetAllDetails.js (Can be used by any organization) - This is used to get all the (current, in the world state) details of the patient which have already been sent to the blockchain via all the transactions. If a particular transaction has not done, you will notice 'N/A' as the values. The following details have to be given as input parameters (as String type) to the application - Patient first name and patient ID. Example (issue command from Patient directory): node Transactions/GetPersonalDetails.js Chris 12345
