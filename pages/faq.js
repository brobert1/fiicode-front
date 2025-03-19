import React from "react";
import { Accordion } from "react-bootstrap";

const FAQ = () => {
  return (
    <>
      <h2 className="text-center text-blue-600 mt-6 mb-9 font-bold text-2xl">- Frequently Asked Questions -</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4"> 
          <Accordion >
            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="0">
              <Accordion.Header>🌱 What is Pathly?</Accordion.Header>
              <Accordion.Body>
              Pathly is a sustainable ridesharing platform that connects passengers with eco-friendly transportation options, reducing carbon footprints and promoting greener travel.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="1">
              <Accordion.Header>📝 How do I sign up for Pathly?</Accordion.Header>
              <Accordion.Body>
              Simply download the Pathly app, create an account using your email or phone number, and follow the verification steps to start driving sustainably.
              </Accordion.Body>
            </Accordion.Item>

            
            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="2">
              <Accordion.Header>📞 How can I contact Pathly support?</Accordion.Header>
              <Accordion.Body>
                You can reach our support team via email at <b>support@Pathly.com </b> or +4072987654.
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="3">
              <Accordion.Header>🚲 What types of eco-friendly vehicles are available?</Accordion.Header>
              <Accordion.Body>
                Pathly offers electric cars, hybrid vehicles, e-bikes, and even shared rides to promote sustainable travel options.
              </Accordion.Body>
            </Accordion.Item>
           

            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="4">
              <Accordion.Header>🔒 How secure is my personal data on Pathly?</Accordion.Header>
              <Accordion.Body>
                We prioritize your privacy and use the highest standards of encryption to protect your data.
              </Accordion.Body>
            </Accordion.Item>

           

            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="5">
              <Accordion.Header>🌍 How does Pathly help the environment?</Accordion.Header>
              <Accordion.Body>
              Pathly reduces carbon emissions by promoting electric and hybrid vehicles, offering shared rides, and supporting sustainability initiatives.
              </Accordion.Body>
            </Accordion.Item>

            

            <Accordion.Item className="mb-5 rounded-xl shadow-xl" eventKey="6">
              <Accordion.Header>🔒 How does Pathly protect my personal data?</Accordion.Header>
              <Accordion.Body>
              We use advanced encryption and security protocols to ensure your personal information is safe and never shared without consent.
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FAQ;
