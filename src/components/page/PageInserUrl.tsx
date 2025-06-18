import React, { useState, useRef } from "react";

const PageInserUrl: React.FC = () => {
  const [recipient, setRecipient] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const urlRef = useRef<HTMLInputElement>(null);

  const invitationUrl = `${
    import.meta.env.VITE_API_URL
  }/agung-mila?to=${encodeURIComponent(recipient)}`;

  const getFormattedInvitationText = () => {
    return `💐 UNDANGAN PERNIKAHAN 💐

Kepada Yth:
${recipient}

Segala puji bagi Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan ini kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami :

Agung

dengan

Mila

Insyaa Allah yang akan diselenggarakan pada:
06 July 2025

🏢 Tempat Acara
Gedung Widya Maharany (GWM), Jl. Makmur, Labuh Baru Bar., Kec. Payung Sekaki, Kota Pekanbaru, Riau 28293

Klik link berikut untuk Undangan Resmi:
${invitationUrl}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a terbaiknya.


Terima kasih

💌
Wedding E-Invitation ini merupakan undangan resmi dari kami, karena jarak & waktu kami mohon maaf apabila mengirim undangan ini melalui media online. Semoga tidak mengurangi rasa hormat dan makna serta isinya.

Kami yang berbahagia,
Agung & Mila`;
  };

  const handleCopyUrl = () => {
    const textToCopy = getFormattedInvitationText();
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy");
      });
  };

  return (
    <div className="url-generator-container">
      <h2>Create Invitation URL</h2>

      <div className="form-group">
        <label htmlFor="recipient">Recipient Name:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient name"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">Invitation URL:</label>
        <div className="url-copy-container">
          <input
            ref={urlRef}
            type="text"
            id="url"
            value={invitationUrl}
            readOnly
            className="input-field url-field"
          />
          <button
            onClick={handleCopyUrl}
            className="copy-button"
            disabled={!recipient}
          >
            {copySuccess || "Copy Invitation"}
          </button>
        </div>
      </div>

      <style>{`
                .url-generator-container {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                }
                
                h2 {
                    margin-bottom: 20px;
                    color: #333;
                    text-align: center;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                
                .input-field {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }
                
                .url-copy-container {
                    display: flex;
                    gap: 10px;
                }
                
                .url-field {
                    flex-grow: 1;
                    background-color: #f9f9f9;
                }
                
                .copy-button {
                    padding: 10px 15px;
                    background-color: #4a90e2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .copy-button:hover {
                    background-color: #357abD;
                }
                
                .copy-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            `}</style>
    </div>
  );
};

export default PageInserUrl;
