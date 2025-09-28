"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFhevm } from "@/fhevm/useFhevm";
import { useConfidentialHealthSurvey } from "@/hooks/useConfidentialHealthSurvey";
import { GenericStringInMemoryStorage } from "@/fhevm/GenericStringStorage";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Header } from "./Header";
import { StatusBar } from "./StatusBar";
import { CreateSurveyForm } from "./CreateSurveyForm";
import { SubmitSurveyForm } from "./SubmitSurveyForm";
import { SurveyList } from "./SurveyList";
import { AggregateData } from "./AggregateData";
import { ConnectWallet } from "./ConnectWallet";

interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

export const ConfidentialHealthSurveyDemo = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [fhevmDecryptionSignatureStorage] = useState(
    () => new GenericStringInMemoryStorage()
  );

  const sameChain = useRef<(chainId: number | undefined) => boolean>(() => false);
  const sameSigner = useRef<(ethersSigner: ethers.JsonRpcSigner | undefined) => boolean>(() => false);

  const { instance, status: fhevmStatus } = useFhevm({
    provider: typeof window !== 'undefined' ? window.ethereum : undefined,
    chainId: chainId,
    enabled: isConnected,
  });

  const [ethersSigner, setEthersSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);
  const [ethersReadonlyProvider, setEthersReadonlyProvider] = useState<ethers.ContractRunner | undefined>(undefined);

  // Survey form state
  const [surveyForm, setSurveyForm] = useState({
    title: "",
    description: "",
    metadataPointer: "QmTest123456789abcdef",
    questionSchemaPointer: "QmTest987654321fedcba",
    submitDeadline: Math.floor(Date.now() / 1000) + 86400 * 7,
    allowIndividualReveal: false,
    questions: [] as Question[],
  });

  const [submissionForm, setSubmissionForm] = useState({
    surveyId: 1,
    answers: [0], // Start with just one answer slot
    commitment: "0x1111111111111111111111111111111111111111111111111111111111111111",
    ciphertextStoragePointer: "ipfs://test123",
  });

  // Selected survey state
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  
  // Decryption state
  const [decryptingQuestion, setDecryptingQuestion] = useState<string | null>(null);

  const {
    contractAddress,
    surveys,
    aggregateHandles,
    clearAggregates,
    clearAllAggregates,
    canInteract,
    canDecryptAggregate,
    canSubmit,
    createSurvey,
    submitSurveyEntry,
    decryptAggregate,
    loadAggregateHandles,
    message,
    isLoading,
    isDecrypting,
    isSubmitting,
    isDeployed
  } = useConfidentialHealthSurvey({
    instance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: typeof window !== 'undefined' ? window.ethereum : undefined,
    chainId: chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  // Setup ethers providers
  useEffect(() => {
    if (isConnected && typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setEthersReadonlyProvider(provider);
      
      provider.getSigner().then(signer => {
        setEthersSigner(signer);
      });
    } else {
      setEthersSigner(undefined);
      setEthersReadonlyProvider(undefined);
    }
  }, [isConnected]);

  // Update refs
  useEffect(() => {
    sameChain.current = (currentChainId: number | undefined) => currentChainId === chainId;
    sameSigner.current = (currentSigner: ethers.JsonRpcSigner | undefined) => 
      currentSigner?.address === ethersSigner?.address;
  }, [chainId, ethersSigner]);

  const handleCreateSurvey = useCallback(async (formData?: typeof surveyForm) => {
    const currentForm = formData || surveyForm;
    
    if (!currentForm.title || !currentForm.description) {
      alert("Please fill in title and description");
      return;
    }

    console.log('Creating survey with questionSchemaPointer:', currentForm.questionSchemaPointer);
    console.log('Full survey form:', currentForm);

    await createSurvey(
      currentForm.title,
      currentForm.description,
      currentForm.metadataPointer,
      currentForm.questionSchemaPointer,
      currentForm.submitDeadline,
      currentForm.allowIndividualReveal,
      []
    );
  }, [surveyForm, createSurvey]);

  const handleSubmitSurvey = useCallback(async () => {
    // Get the current survey to check how many questions it has
    const currentSurvey = surveys.find(s => s.id === submissionForm.surveyId);
    if (!currentSurvey) {
      alert("Please select a survey");
      return;
    }

    // Check if all questions are answered
    // For now, we'll check if at least one answer is provided
    if (submissionForm.answers.length === 0 || submissionForm.answers[0] === 0) {
      alert("Please answer all questions");
      return;
    }

    let commitment = submissionForm.commitment;
    if (!commitment || commitment.length !== 66 || !commitment.startsWith('0x')) {
      commitment = "0x0000000000000000000000000000000000000000000000000000000000000000";
    }

    let ciphertextStoragePointer = submissionForm.ciphertextStoragePointer;
    if (!ciphertextStoragePointer || ciphertextStoragePointer.trim() === "") {
      ciphertextStoragePointer = "ipfs://placeholder";
    }

    await submitSurveyEntry(
      submissionForm.surveyId,
      submissionForm.answers,
      commitment,
      ciphertextStoragePointer
    );
  }, [submissionForm, submitSurveyEntry, surveys]);

  const handleDecryptAggregate = useCallback(async (surveyId: number, questionId: number) => {
    const questionKey = `${surveyId}-${questionId}`;
    console.log('handleDecryptAggregate called:', { surveyId, questionId, questionKey, canDecryptAggregate, isDecrypting });
    setDecryptingQuestion(questionKey);
    try {
      await decryptAggregate(surveyId, questionId);
    } finally {
      setDecryptingQuestion(null);
    }
  }, [decryptAggregate, canDecryptAggregate, isDecrypting]);

  const handleLoadAggregates = useCallback(async (surveyId: number) => {
    setSelectedSurveyId(surveyId);
    
    // Clear existing aggregates first
    clearAllAggregates();
    
    // Find the selected survey to get the actual number of questions
    const selectedSurvey = surveys.find(s => s.id === surveyId);
    if (!selectedSurvey) {
      console.error('Survey not found:', surveyId);
      return;
    }
    
    // Try to get the actual number of questions from the survey's question schema
    let questionCount = 1; // Default to 1 question
    
    try {
      // Look for questions in localStorage using the survey's questionSchemaPointer
      const storageKey = `survey_questions_${selectedSurvey.questionSchemaPointer}`;
      const storedQuestions = localStorage.getItem(storageKey);
      
      if (storedQuestions) {
        const parsed = JSON.parse(storedQuestions);
        questionCount = parsed.questions ? parsed.questions.length : 1;
        console.log('Found questions in localStorage:', parsed.questions?.length || 0);
      } else {
        console.log('No questions found in localStorage for schema:', selectedSurvey.questionSchemaPointer);
      }
    } catch (error) {
      console.error('Error parsing question schema:', error);
    }
    
    console.log('Loading aggregates for survey:', surveyId, 'with', questionCount, 'questions');
    
    for (let questionId = 0; questionId < questionCount; questionId++) {
      await loadAggregateHandles(surveyId, questionId);
    }
  }, [loadAggregateHandles, surveys, clearAllAggregates]);

  const handleClearAggregates = useCallback(() => {
    setSelectedSurveyId(null);
    clearAllAggregates();
  }, [clearAllAggregates]);

  if (!isConnected) {
    return <ConnectWallet onConnect={() => connect({ connector: injected() })} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <Header 
        address={address} 
        chainId={chainId} 
        onDisconnect={disconnect} 
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatusBar 
          fhevmStatus={fhevmStatus}
          isDeployed={isDeployed ?? false}
          contractAddress={contractAddress}
          isLoading={isLoading}
          message={message}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreateSurveyForm
            form={surveyForm}
            onFormChange={setSurveyForm}
            onSubmit={handleCreateSurvey}
            canInteract={canInteract ?? false}
            isSubmitting={isSubmitting ?? false}
          />
          
          <SubmitSurveyForm
            form={submissionForm}
            onFormChange={setSubmissionForm}
            surveys={surveys}
            onSubmit={handleSubmitSurvey}
            canSubmit={canSubmit ?? false}
            isSubmitting={isSubmitting ?? false}
          />
        </div>

        {surveys.length > 0 && (
          <div className="mt-8">
            <SurveyList
              surveys={surveys}
              onLoadAggregates={handleLoadAggregates}
              onClearAggregates={handleClearAggregates}
              selectedSurveyId={selectedSurveyId}
            />
          </div>
        )}

        {selectedSurveyId && Object.keys(aggregateHandles).length > 0 && (
          <div className="mt-8">
            <AggregateData
              aggregateHandles={aggregateHandles}
              clearAggregates={clearAggregates}
              onDecrypt={handleDecryptAggregate}
              canDecrypt={canDecryptAggregate ?? false}
              isDecrypting={isDecrypting ?? false}
              selectedSurveyId={selectedSurveyId}
              decryptingQuestion={decryptingQuestion}
            />
          </div>
        )}
      </div>
    </div>
  );
};