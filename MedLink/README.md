Idea Presentation
[Presenation](https://www.canva.com/design/DAE963Wmbjs/kZgyiRKt_1TGDvCRTAyTjQ/view?utm_content=DAE963Wmbjs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Inspiration

Currently, the rapid development of information technology has made electronic information systems more widely used in medical treatment, and a large amount of medical data is generated every day, such as electronic medical records, medical images, diagnostic reports, infectious diseases, etc. As health systems and hospitals are under unprecedented stress from the COVID-19 pandemic, their IT departments also are facing critical skills and staffing shortages as they battle unrelenting cyberattacks.

## What it does

Our solution is to develop a global decentralized account for patients to store medical information such as medical records, previous appointments, and other information that is shared across all hospitals. We develop a universal account for patients, where information on the patient can be added by all hospitals. Both patients and hospitals would benefit from this.
We take a novel approach by leveraging IPFS, a decentralized and secure system. Storing a medical record, such as a PDF, or images (such as X-rays), takes up a lot of space, which costs hospitals money. In our approach, we upload the records in IPFS and are divided into nodes via this method, which returns a unique hash value for each record. The patient s medical record will be retrieved using this hash value. For medical records, storing the hash value is much less expensive than storing the entire PDF/image.

We are trying to deploy the project in **L2 Optimism** for faster transactions and use the **synthetix protocal**.

## How we built it

We are building a web interface for both patients and doctors where they can see and upload medical records in a secured channel.
The application uses
[Solidity](https://docs.soliditylang.org/en/v0.8.13/) in Backend

[React JS](https://reactjs.org/) for front-end

[MetaMask](https://metamask.io/) for authetication

[Ganache](https://trufflesuite.com/ganache/) for personal Ethereum blockchain

## Challenges we ran into

Firstly writing smart contracts in solidity since it is in begging versions of development we are not able to create arrays and maps in the structures.
Next is connecting the ipfs to upload the medical records.

## What we learned

We are learning to write smart contracts in solidity, we are also learning different tools in P2P networks like IPFS.
