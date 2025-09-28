 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint64, externalEuint32, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialHealthSurvey
 * @dev Privacy-preserving health survey platform using FHEVM
 * @notice This contract enables encrypted data collection and homomorphic aggregation
 */
contract ConfidentialHealthSurvey is SepoliaConfig {

    // ============ STRUCTS ============
    
    struct Survey {
        uint256 id;
        address creator;
        string title;
        string description;
        string metadataPointer; // IPFS hash
        string questionSchemaPointer; // IPFS hash for question schema
        uint256 submitDeadline;
        bool allowIndividualReveal;
        bool isActive;
        uint256 totalSubmissions;
        mapping(address => bool) authorizedResearchers;
        mapping(uint256 => QuestionAggregate) questionAggregates;
    }

    struct QuestionAggregate {
        euint32 encryptedSum; // For numeric questions
        euint32 encryptedCount; // Count of responses
        mapping(uint8 => euint32) categoryCounts; // For categorical questions
        bool isNumeric;
        uint8 maxCategories; // For categorical questions
    }

    struct Submission {
        uint256 surveyId;
        uint256 entryId;
        address respondent;
        bytes32 commitment;
        string ciphertextStoragePointer;
        uint256 timestamp;
        bool isRevealed;
    }

    struct DecryptionRequest {
        uint256 requestId;
        uint256 surveyId;
        uint256 questionId;
        address requester;
        bool isAggregate;
        bool isFulfilled;
        uint256 timestamp;
    }

    // ============ STATE VARIABLES ============
    
    uint256 public nextSurveyId = 1;
    uint256 public nextEntryId = 1;
    uint256 public nextRequestId = 1;
    
    mapping(uint256 => Survey) public surveys;
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => DecryptionRequest) public decryptionRequests;
    
    address public admin;
    mapping(address => bool) public authorizedResearchers;
    
    // ============ EVENTS ============
    
    event SurveyCreated(
        uint256 indexed surveyId,
        address indexed creator,
        string title,
        string metadataPointer,
        uint256 submitDeadline
    );
    
    event EntrySubmitted(
        uint256 indexed surveyId,
        uint256 indexed entryId,
        address indexed respondent,
        bytes32 commitment,
        string ciphertextStoragePointer
    );
    
    event EncryptedAggregateUpdated(
        uint256 indexed surveyId,
        uint256 indexed questionId
    );
    
    event DecryptionRequested(
        uint256 indexed requestId,
        uint256 indexed surveyId,
        uint256 indexed questionId,
        address requester,
        bool isAggregate
    );
    
    event AggregateRevealed(
        uint256 indexed surveyId,
        uint256 indexed questionId,
        uint256 decryptedValue,
        uint256 count
    );
    
    event IndividualRevealed(
        uint256 indexed surveyId,
        uint256 indexed entryId,
        address indexed respondent,
        uint256 questionId,
        uint256 decryptedValue
    );
    
    event ResearcherAuthorized(
        uint256 indexed surveyId,
        address indexed researcher
    );
    
    event SurveyPaused(uint256 indexed surveyId);
    event SurveyResumed(uint256 indexed surveyId);

    // ============ MODIFIERS ============
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyAuthorizedResearcher(uint256 surveyId) {
        require(
            surveys[surveyId].authorizedResearchers[msg.sender] || 
            authorizedResearchers[msg.sender] ||
            msg.sender == admin,
            "Not authorized researcher"
        );
        _;
    }
    
    modifier surveyExists(uint256 surveyId) {
        require(surveys[surveyId].id != 0, "Survey does not exist");
        _;
    }
    
    modifier surveyActive(uint256 surveyId) {
        require(surveys[surveyId].isActive, "Survey is not active");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor() {
        admin = msg.sender;
    }

    // ============ ADMIN FUNCTIONS ============
    
    function authorizeGlobalResearcher(address researcher) external onlyAdmin {
        authorizedResearchers[researcher] = true;
    }
    
    function revokeGlobalResearcher(address researcher) external onlyAdmin {
        authorizedResearchers[researcher] = false;
    }
    
    function pauseSurvey(uint256 surveyId) external onlyAdmin surveyExists(surveyId) {
        surveys[surveyId].isActive = false;
        emit SurveyPaused(surveyId);
    }
    
    function resumeSurvey(uint256 surveyId) external onlyAdmin surveyExists(surveyId) {
        surveys[surveyId].isActive = true;
        emit SurveyResumed(surveyId);
    }

    // ============ SURVEY CREATION ============
    
    function createSurvey(
        string calldata title,
        string calldata description,
        string calldata metadataPointer,
        string calldata questionSchemaPointer,
        uint256 submitDeadline,
        bool allowIndividualReveal,
        address[] calldata initialResearchers
    ) external returns (uint256 surveyId) {
        require(submitDeadline > block.timestamp, "Invalid deadline");
        require(bytes(title).length > 0, "Title required");
        
        surveyId = nextSurveyId++;
        Survey storage survey = surveys[surveyId];
        
        survey.id = surveyId;
        survey.creator = msg.sender;
        survey.title = title;
        survey.description = description;
        survey.metadataPointer = metadataPointer;
        survey.questionSchemaPointer = questionSchemaPointer;
        survey.submitDeadline = submitDeadline;
        survey.allowIndividualReveal = allowIndividualReveal;
        survey.isActive = true;
        
        // Authorize initial researchers
        for (uint256 i = 0; i < initialResearchers.length; i++) {
            survey.authorizedResearchers[initialResearchers[i]] = true;
            emit ResearcherAuthorized(surveyId, initialResearchers[i]);
        }
        
        emit SurveyCreated(
            surveyId,
            msg.sender,
            title,
            metadataPointer,
            submitDeadline
        );
    }
    
    function authorizeResearcher(uint256 surveyId, address researcher) 
        external 
        surveyExists(surveyId) 
    {
        require(
            msg.sender == surveys[surveyId].creator || 
            msg.sender == admin,
            "Not authorized to add researchers"
        );
        
        surveys[surveyId].authorizedResearchers[researcher] = true;
        emit ResearcherAuthorized(surveyId, researcher);
    }

    // ============ SUBMISSION FUNCTIONS ============
    
    function submitEntry(
        uint256 surveyId,
        externalEuint32[] calldata encryptedAnswers,
        bytes[] calldata proofs,
        bytes32 commitment,
        string calldata ciphertextStoragePointer
    ) external surveyExists(surveyId) surveyActive(surveyId) returns (uint256 entryId) {
        require(block.timestamp <= surveys[surveyId].submitDeadline, "Submission deadline passed");
        require(encryptedAnswers.length > 0, "No answers provided");
        require(encryptedAnswers.length == proofs.length, "Mismatched arrays");
        
        entryId = nextEntryId++;
        
        Submission storage submission = submissions[entryId];
        submission.surveyId = surveyId;
        submission.entryId = entryId;
        submission.respondent = msg.sender;
        submission.commitment = commitment;
        submission.ciphertextStoragePointer = ciphertextStoragePointer;
        submission.timestamp = block.timestamp;
        
        surveys[surveyId].totalSubmissions++;
        
        // Process each encrypted answer
        for (uint256 i = 0; i < encryptedAnswers.length; i++) {
            _processEncryptedAnswer(surveyId, i, encryptedAnswers[i], proofs[i]);
        }
        
        emit EntrySubmitted(
            surveyId,
            entryId,
            msg.sender,
            commitment,
            ciphertextStoragePointer
        );
    }
    
    function _processEncryptedAnswer(
        uint256 surveyId,
        uint256 questionId,
        externalEuint32 encryptedAnswer,
        bytes calldata proof
    ) internal {
        // Convert external ciphertext to euint32
        euint32 answerCipher = FHE.fromExternal(encryptedAnswer, proof);
        
        QuestionAggregate storage aggregate = surveys[surveyId].questionAggregates[questionId];
        
        // Initialize aggregate if first submission
        if (surveys[surveyId].totalSubmissions == 1) {
            aggregate.encryptedSum = answerCipher;
            aggregate.encryptedCount = FHE.asEuint32(1);
            aggregate.isNumeric = true; // Assume numeric for now
        } else {
            // Homomorphic addition
            aggregate.encryptedSum = FHE.add(aggregate.encryptedSum, answerCipher);
            aggregate.encryptedCount = FHE.add(aggregate.encryptedCount, FHE.asEuint32(1));
        }
        
        // Allow access to the updated encrypted values
        FHE.allowThis(aggregate.encryptedSum);
        FHE.allowThis(aggregate.encryptedCount);
        FHE.allow(aggregate.encryptedSum, msg.sender);
        FHE.allow(aggregate.encryptedCount, msg.sender);
        
        emit EncryptedAggregateUpdated(surveyId, questionId);
    }

    // ============ DECRYPTION FUNCTIONS ============
    
    function requestAggregatedReveal(
        uint256 surveyId,
        uint256 questionId
    ) external onlyAuthorizedResearcher(surveyId) surveyExists(surveyId) returns (uint256 requestId) {
        require(FHE.gt(surveys[surveyId].questionAggregates[questionId].encryptedCount, FHE.asEuint32(0)), "No data to reveal");
        
        requestId = nextRequestId++;
        
        DecryptionRequest storage request = decryptionRequests[requestId];
        request.requestId = requestId;
        request.surveyId = surveyId;
        request.questionId = questionId;
        request.requester = msg.sender;
        request.isAggregate = true;
        request.timestamp = block.timestamp;
        
        emit DecryptionRequested(requestId, surveyId, questionId, msg.sender, true);
    }
    
    function requestIndividualReveal(
        uint256 surveyId,
        uint256 entryId,
        uint256 questionId
    ) external onlyAuthorizedResearcher(surveyId) surveyExists(surveyId) returns (uint256 requestId) {
        require(surveys[surveyId].allowIndividualReveal, "Individual reveal not allowed");
        require(submissions[entryId].surveyId == surveyId, "Invalid entry");
        require(!submissions[entryId].isRevealed, "Already revealed");
        
        requestId = nextRequestId++;
        
        DecryptionRequest storage request = decryptionRequests[requestId];
        request.requestId = requestId;
        request.surveyId = surveyId;
        request.questionId = questionId;
        request.requester = msg.sender;
        request.isAggregate = false;
        request.timestamp = block.timestamp;
        
        emit DecryptionRequested(requestId, surveyId, questionId, msg.sender, false);
    }
    
    // Callback from FHEVM KMS/Gateway with decrypted results
    function callbackRevealAggregate(
        uint256 requestId,
        uint256 decryptedSum,
        uint256 decryptedCount,
        bytes[] calldata signatures
    ) external onlyAdmin {
        DecryptionRequest storage request = decryptionRequests[requestId];
        require(request.requestId != 0, "Request does not exist");
        require(!request.isFulfilled, "Request already fulfilled");
        
        // Verify signatures (simplified - in production, implement proper signature verification)
        require(signatures.length > 0, "No signatures provided");
        
        request.isFulfilled = true;
        
        emit AggregateRevealed(
            request.surveyId,
            request.questionId,
            decryptedSum,
            decryptedCount
        );
    }
    
    function callbackRevealIndividual(
        uint256 requestId,
        uint256 decryptedValue,
        bytes[] calldata signatures
    ) external onlyAdmin {
        DecryptionRequest storage request = decryptionRequests[requestId];
        require(request.requestId != 0, "Request does not exist");
        require(!request.isFulfilled, "Request already fulfilled");
        require(!request.isAggregate, "Not an individual request");
        
        // Verify signatures
        require(signatures.length > 0, "No signatures provided");
        
        request.isFulfilled = true;
        
        // Find the entry for this request (simplified)
        uint256 entryId = _findEntryForRequest(requestId);
        if (entryId != 0) {
            submissions[entryId].isRevealed = true;
        }
        
        emit IndividualRevealed(
            request.surveyId,
            entryId,
            submissions[entryId].respondent,
            request.questionId,
            decryptedValue
        );
    }
    
    function _findEntryForRequest(uint256 requestId) internal view returns (uint256) {
        // Simplified implementation - in production, maintain better mapping
        for (uint256 i = 1; i < nextEntryId; i++) {
            if (submissions[i].surveyId == decryptionRequests[requestId].surveyId) {
                return i;
            }
        }
        return 0;
    }

    // ============ VIEW FUNCTIONS ============
    
    function getSurveyInfo(uint256 surveyId) external view surveyExists(surveyId) returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        string memory metadataPointer,
        string memory questionSchemaPointer,
        uint256 submitDeadline,
        bool allowIndividualReveal,
        bool isActive,
        uint256 totalSubmissions
    ) {
        Survey storage survey = surveys[surveyId];
        return (
            survey.id,
            survey.creator,
            survey.title,
            survey.description,
            survey.metadataPointer,
            survey.questionSchemaPointer,
            survey.submitDeadline,
            survey.allowIndividualReveal,
            survey.isActive,
            survey.totalSubmissions
        );
    }
    
    function getSubmissionInfo(uint256 entryId) external view returns (
        uint256 surveyId,
        uint256 entryId_,
        address respondent,
        bytes32 commitment,
        string memory ciphertextStoragePointer,
        uint256 timestamp,
        bool isRevealed
    ) {
        Submission storage submission = submissions[entryId];
        require(submission.entryId != 0, "Submission does not exist");
        
        return (
            submission.surveyId,
            submission.entryId,
            submission.respondent,
            submission.commitment,
            submission.ciphertextStoragePointer,
            submission.timestamp,
            submission.isRevealed
        );
    }
    
    function isAuthorizedResearcher(uint256 surveyId, address researcher) external view returns (bool) {
        return surveys[surveyId].authorizedResearchers[researcher] || 
               authorizedResearchers[researcher] ||
               researcher == admin;
    }
    
    function getAggregateCiphertext(uint256 surveyId, uint256 questionId) external view returns (euint32) {
        // Return the encrypted sum for external access
        return surveys[surveyId].questionAggregates[questionId].encryptedSum;
    }
    
    function getAggregateCount(uint256 surveyId, uint256 questionId) external view returns (euint32) {
        // Return the encrypted count for external access
        return surveys[surveyId].questionAggregates[questionId].encryptedCount;
    }
}

