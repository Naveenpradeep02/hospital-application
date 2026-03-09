CREATE TABLE admins (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 password TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




ALTER TABLE admins
ADD COLUMN otp VARCHAR(6),
ADD COLUMN otp_expiry TIMESTAMP;



CREATE TABLE patients (
 id SERIAL PRIMARY KEY,
 name VARCHAR(150) NOT NULL,
 age INT,
 gender VARCHAR(10),
 phone VARCHAR(20),
 address TEXT,
 reference VARCHAR(150),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM patients;



INSERT INTO patients (name, age, gender, phone, address, reference)
VALUES (
  'Ravi Kumar',
  35,
  'Male',
  '9876543210',
  'Chennai',
  'Google'
);

INSERT INTO patients (name, age, gender, phone, address, reference)
VALUES
('Lakshmi', 32, 'Female', '9876543211', 'Madurai', 'Friend'),
('Arun', 28, 'Male', '9876543212', 'Coimbatore', 'Website'),
('Meena', 41, 'Female', '9876543213', 'Salem', 'Doctor'),
('Suresh', 50, 'Male', '9876543214', 'Trichy', 'Advertisement');




CREATE TABLE doctors (
 id SERIAL PRIMARY KEY,
 name VARCHAR(150),
 specialization VARCHAR(150),
 phone VARCHAR(20),
 email VARCHAR(150),
 consultation_fee INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE appointments (
 id SERIAL PRIMARY KEY,
 patient_id INT REFERENCES patients(id),
 doctor_id INT REFERENCES doctors(id),

 appointment_date DATE,
 appointment_time TIME,

 token_number INT,

 status VARCHAR(20) DEFAULT 'pending',

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE bills (

 id SERIAL PRIMARY KEY,

 appointment_id INT REFERENCES appointments(id),

 subtotal NUMERIC,
 tax NUMERIC,
 total NUMERIC,

 payment_mode VARCHAR(20),

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE bill_items (

 id SERIAL PRIMARY KEY,

 bill_id INT REFERENCES bills(id),

 item_name VARCHAR(200),
 item_type VARCHAR(50),

 amount NUMERIC

);

ALTER TABLE bills
ADD COLUMN bill_number VARCHAR(50);


ALTER TABLE doctors
ADD COLUMN active BOOLEAN DEFAULT true;

ALTER TABLE patients
ADD COLUMN email VARCHAR(150);