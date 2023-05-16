export default function EndToEnd() {
  return (
    <div className=' font-mono text-lg pt-xl flex flex-col gap-md mx-auto w-[80%] md:w-[75%] lg:w-[60%] '>
      <h1 className='text-3xl font-mono'>How smalltalk's end-to-end encryption works?</h1>
      <p>End-to-end encryption (E2EE) is a method of secure communication that ensures that only the sender and the intended recipient can access the data being transferred. This is achieved by encrypting the data at the sender's end and decrypting it at the recipient's end, with the encryption keys stored only on the endpoints. This approach uses public key encryption, which stores private keys on the endpoint, and is often used in the finance, healthcare, and communications industries to comply with data privacy and security regulations and laws.</p>

      <p>The encryption process begins with the sender's device generating a unique key pair consisting of a public key and a private key. The public key is shared with the recipient, while the private key is kept secret. When the sender sends a message, it is encrypted using the recipient's public key, which can only be decrypted using the recipient's private key. This ensures that only the intended recipient can read the message.</p>
      <p>End-to-end encryption is used in various applications, including messaging apps, email services, and cloud storage. It provides a high level of data privacy, ensuring that the data is secure in transit and at rest. It also protects against man-in-the-middle attacks, where an attacker intercepts the communication and alters the data being transferred.</p>
      <p>One of the main advantages of end-to-end encryption is that it provides security in transit. This is because the encryption and decryption of the messages happen only at the endpoints, the sender and the receiver ends. The message is not encrypted or decrypted at any point in transit. Even the server relaying and storing your message cannot decipher and read your message.</p>
      <p>However, there are some drawbacks to end-to-end encryption. One of the main drawbacks is that it can be difficult to implement and use. Users must ensure that they have the correct encryption keys and that they are using a secure communication channel. Additionally, end-to-end encryption can make it difficult for law enforcement agencies to access data for legitimate reasons, such as in criminal investigations.</p>

      <p>In conclusion, end-to-end encryption is a powerful tool for ensuring data privacy and security. It provides a high level of protection against unauthorized access and interception, making it an essential tool for anyone who values their privacy and security. While there are some drawbacks to end-to-end encryption, the benefits far outweigh the risks, and it is likely to become even more important in the future as more and more data is transferred online.</p>
    </div>
  );
}
