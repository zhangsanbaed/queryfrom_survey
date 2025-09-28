# Confidential Health Surveys

A privacy-preserving health survey platform built with FHEVM (Fully Homomorphic Encryption Virtual Machine) that enables researchers to collect sensitive health data while maintaining complete privacy protection.

> 🌐 **Live Demo**: [https://zhangsanbaed.github.io/queryform/](https://zhangsanbaed.github.io/queryform/)

## 🔒 Privacy Features

- **End-to-End Encryption**: All responses are encrypted on the user's device using FHEVM
- **Homomorphic Computation**: Statistical analysis happens on encrypted data without revealing individual responses
- **Zero-Knowledge Proofs**: Cryptographic proofs ensure data integrity without revealing content
- **Controlled Decryption**: Only authorized researchers can request aggregated results with proper authorization

## 🏗️ Architecture

### Smart Contracts (FHEVM + Solidity)
- **ConfidentialHealthSurvey.sol**: Main contract handling survey creation, submission, and aggregation
- **Homomorphic Operations**: FHE.add, FHE.count for encrypted statistical computation
- **Access Control**: Role-based permissions for researchers and administrators
- **Event Logging**: Comprehensive audit trail for all operations

### Frontend (React + Next.js)
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Wallet Integration**: MetaMask and WalletConnect support via Wagmi
- **FHEVM Integration**: Seamless encryption/decryption using Relayer SDK
- **Real-time Updates**: Live survey status and submission tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Git
- MetaMask browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd confidential-health-surveys
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   # Update contract configuration
   cp packages/contracts/env.example packages/contracts/.env
   # Edit packages/contracts/.env with your settings
   
   # Update frontend configuration
   cp packages/frontend/env.example packages/frontend/.env.local
   # Edit packages/frontend/.env.local with your settings
   ```

### Development

1. **Start Hardhat node** (Terminal 1)
   ```bash
   npm run dev:contracts
   ```

2. **Deploy contracts** (Terminal 2)
   ```bash
   npm run deploy:local
   ```

3. **Start frontend** (Terminal 3)
   ```bash
   npm run dev:frontend
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📋 Usage

### For Researchers

1. **Connect Wallet**: Use MetaMask to connect to the local Hardhat network
2. **Create Survey**: Define questions, privacy settings, and access controls
3. **Monitor Responses**: View encrypted submission counts and request aggregated results
4. **Access Results**: Request decryption of aggregated statistics with proper authorization

### For Respondents

1. **Connect Wallet**: Connect your wallet to participate in surveys
2. **Browse Surveys**: View available surveys with privacy information
3. **Submit Responses**: Fill out surveys with automatic client-side encryption
4. **Privacy Assurance**: Your responses are encrypted before leaving your device

## 🔧 Configuration

### Local Development (Hardhat)
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency**: ETH

### Production (Sepolia Testnet)
- **RPC URL**: Your Infura/Alchemy endpoint
- **Chain ID**: `11155111`
- **Currency**: ETH

## 🛠️ Technical Details

### FHEVM Integration
- **Encryption**: Client-side encryption using Relayer SDK
- **Homomorphic Operations**: FHE.add for encrypted aggregation
- **Decryption**: Threshold decryption with KMS/Gateway
- **Proofs**: ZKPoK for input validation

### Smart Contract Features
- **Survey Management**: Create, pause, resume surveys
- **Access Control**: Researcher authorization and role management
- **Encrypted Storage**: Homomorphic accumulators for statistics
- **Event Logging**: Comprehensive audit trail

### Frontend Features
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live status updates via event listeners
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth UX during encryption/decryption operations

## 📊 Survey Types

### Numeric Questions
- Rating scales (1-10)
- Age, count, duration
- Homomorphic addition for averages

### Categorical Questions
- Multiple choice options
- Homomorphic counting for distributions
- Privacy-preserving frequency analysis

### Boolean Questions
- Yes/No responses
- Encrypted boolean operations
- Aggregate true/false counts

## 🔐 Security Considerations

- **Client-Side Encryption**: Data never leaves device in plain text
- **Zero-Knowledge Proofs**: Input validation without revealing values
- **Access Control**: Multi-level authorization system
- **Audit Trail**: Complete event logging for compliance
- **Threshold Decryption**: Multiple signatures required for sensitive operations

## 🧪 Testing

```bash
# Run contract tests
cd packages/contracts
npm test

# Run frontend tests
cd packages/frontend
npm test
```

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/protocol/solidity-guides/)
- [Relayer SDK Guide](https://docs.zama.ai/protocol/relayer-sdk-guides/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a demonstration project for educational purposes. For production use, please:
- Conduct thorough security audits
- Consult legal experts for compliance requirements
- Implement additional privacy protections as needed
- Follow best practices for handling sensitive health data

## 🆘 Support

- [GitHub Issues](https://github.com/your-org/confidential-health-surveys/issues)
- [Discord Community](https://discord.gg/zama)
- [Documentation](https://docs.zama.ai/)

---

Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) and [Zama](https://zama.ai/)

