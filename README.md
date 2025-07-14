# 🔐 TrueHear Decryption CLI

> A secure, terminal-based AES decryption utility for encrypted keys and structured patient data files.

![badge](https://img.shields.io/badge/Node.js-18.x%20or%20above-green)
![badge](https://img.shields.io/badge/CLI-Built%20with%20Inquirer-blue)
![badge](https://img.shields.io/badge/Secure-AES--256--CBC-red)

---

## 📖 Overview

TrueHear Decryption CLI is a cross-platform, interactive command-line tool designed to decrypt sensitive data (such as **AES-encrypted Social Security Numbers**) using a provided **AES-256-CBC** key and IV.

It supports:

* Manual decryption of individual keys
* Bulk decryption via `.json` or `.csv` files
* Live summary and stats
* Secure handling of credentials
* JSON/CSV result exports
* Fully offline functionality

---

## ⚙️ Features

| Feature                            | Description                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| 🔐 AES-256-CBC Decryption          | Decrypt encrypted payloads with AES-256-CBC using a 64-character hex key and 32-character IV.       |
| 👤 Manual Mode                     | Add encrypted keys one-by-one with real-time decryption and result display.                         |
| 📂 Import JSON/CSV                 | Bulk decrypt multiple encrypted values from structured files with `_id` and `socialSecurityNumber`. |
| 📊 Summary Stats                   | View total, successful, and failed decryptions for transparency.                                    |
| 📄 Export Options                  | Export results in `JSON` or `CSV` format with timestamped filenames.                                |
| 🧪 SHA-256 Hashing (utility ready) | Provides a hashing function if needed for integrity validation.                                     |
| 🧼 Input Validation                | Strict format checks to avoid decryption errors and malformed inputs.                               |
| ✨ Clean UI                         | Powered by `inquirer`, `chalk`, and `ora` for user-friendly terminal UI.                            |
| 📦 Cross-Platform Binaries         | Packaged using `pkg` to run on Windows, macOS, and Linux without requiring Node.js installed.       |

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js v18+ (only required for development mode)
* Terminal / shell environment

---

### 🛠️ Installation (Development)

```bash
git clone https://github.com/Sameerbk201/truehear-decryption-cli.git
cd truehear-decryption-cli
npm install
```

### ▶️ Run in Development Mode

```bash
node src/index.js
```

---

### 📦 Build Standalone Executable (with `pkg`)

```bash
npm install -g pkg

pkg . --targets node18-win-x64,node18-linux-x64,node18-macos-x64 --out-path dist
```

> Output binaries will be in the `dist/` directory.

---

## 🧪 AES Key Requirements

| Parameter | Format             | Length        | Example                            |
| --------- | ------------------ | ------------- | ---------------------------------- |
| AES Key   | Hexadecimal string | 64 characters | `2fa72f4bc1c8392a8d3c...`          |
| AES IV    | Hexadecimal string | 32 characters | `af102b4c9d31e21acbda7d0e1742d033` |

### ❗ Validation Rules

* ✅ AES Key must be 64 hex characters (32 bytes)
* ✅ IV must be 32 hex characters (16 bytes)
* ❌ Any deviation will be rejected before decryption

---

## 🧭 Usage Modes

### 1️⃣ Manual Mode – Add Encrypted Keys One-by-One

```bash
> node src/index.js
```

**Steps:**

1. Enter your AES key and IV
2. Choose `➕ Add Encrypted Key`
3. Input encrypted key(s)
4. Choose:

   * `Decrypt all collected keys`
   * `Export`
   * `Back to main menu`

---

### 2️⃣ Import Mode – Bulk Decrypt JSON or CSV

Choose `📂 Import JSON & decrypt` in main menu.

#### 📁 JSON Format

```json
[
  {
    "_id": "659a1a4c537ef9cbb7a16c00",
    "socialSecurityNumber": "7d224f6cc6557e10a099c4d095f344dc"
  }
]
```

#### 📄 CSV Format

```csv
_id,socialSecurityNumber
659a1a4c537ef9cbb7a16c00,7d224f6cc6557e10a099c4d095f344dc
```

You will be prompted to:

* Confirm file path
* Decrypt
* View results in table
* Export to JSON/CSV

---

## 🧾 Output

### Sample Table View (Manual or Import)

| \_id                     | SSN                 |
| ------------------------ | ------------------- |
| 659a1a4c537ef9cbb7a16c00 | 123-45-6789         |
| 659a1a4c537ef9cbb7a16c01 | ❌ Decryption failed |

---

## 📤 Export Options

After decryption:

* 📄 Export results to:

  * `JSON` (pretty-printed)
  * `CSV` (quoted-safe format)
* 📁 Saved to current working directory with timestamped filename:

  * `decryption_results_2025-07-07T14-12-00.json`

---

## 🧼 Input Validations

| Input          | Validation Rule                          |
| -------------- | ---------------------------------------- |
| AES Key        | Must be 64-character hex string          |
| IV             | Must be 32-character hex string          |
| Encrypted Key  | Cannot be empty                          |
| File path      | Must exist and be `.json` or `.csv` file |
| JSON structure | Root must be an array                    |
| CSV structure  | Must have `socialSecurityNumber` column  |

---

## 🙋 FAQ

### ❓ How do I exit?

* Hit `Ctrl+C` at any prompt.

### ❓ Can I drag and drop a file path?

* Yes! Just drag the file into the terminal. If quotes are added (e.g., `'path/to/file.json'`), the app automatically strips them.

### ❓ Are my keys stored?

* ❌ No. All operations are memory-based. No keys or data are written to disk unless explicitly exported.

---

## 📁 Folder Structure

```bash
.
├── src
│   ├── index.js                 # Entry point
│   ├── cli
│   │   ├── prompt.js            # All user prompts (inquirer)
│   │   └── exporter.js          # Export to CSV/JSON
│   ├── core
│   │   ├── decrypt.js           # Manual key input/decryption logic
│   │   ├── importJson.js        # Bulk JSON import logic
│   │   ├── importCsv.js         # Bulk CSV import logic
│   │   └── error.js             # Global error handler
│   └── utils
│       └── EncDec.js            # AES-256 encryption/decryption + hash
├── dist                        # Built binaries (pkg output)
├── package.json
└── README.md                   # You're here 🎉
```

---

## 👨‍💻 Developer Notes

* Written in ES Modules (Node `type: "module"`)
* Uses:

  * `chalk` for colors
  * `inquirer` for prompts
  * `ora` for spinners
  * `fs`, `path`, `crypto` for internal operations
* Compatible with Node.js `v18.x` and above

---

## ✅ Best Practices

* Never commit or log actual AES keys or decrypted SSNs
* Always test decryptions on dummy data
* Keep the app offline for maximum security

---

## 🛡️ Disclaimer

This tool is provided for internal, secure decryption use. It does **not** store or transmit any sensitive data and assumes users are authorized to decrypt the information they provide.

---

## 📬 License & Support

Built with ❤️ by TrueHear Developers

---
